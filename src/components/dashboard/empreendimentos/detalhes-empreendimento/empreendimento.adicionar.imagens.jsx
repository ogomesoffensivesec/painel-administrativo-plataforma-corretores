import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { database } from "@/database/config/firebase";
import useData from "@/hooks/useData";
import { ref, set } from "firebase/database";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

function AdicionarImagens({ empreendimentoId, modeloId, modelo }) {
  const { handleSubmit, register } = useForm();
  const { addNewImagesToModel, counter } = useData();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const novasImagens = await addNewImagesToModel(
        data.imagens,
        empreendimentoId,
        modeloId
      );

      // Obter uma referência para a lista de imagens

      // Adicionar as novas imagens à lista existente
      for (const novaImagem of Object.values(novasImagens)) {
        const referenciaDatabase = ref(
          database,
          `/empreendimentos/${empreendimentoId}/modelos/${counter}/imagens/${novaImagem.id}`
        );
        await set(referenciaDatabase, novaImagem);
      }

      toast({
        title: "Novas imagens adicionadas ao modelo",
        variant: "success",
      });
    } catch (error) {
      // Tratar erros conforme necessário
      console.error("Erro ao adicionar novas imagens:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="h-9 px-3  border-none outline-none w-[200px] bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-2 justify-center items-center text-sm">
        Adicionar imagens <Upload size={14} color="white" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar imagens</DialogTitle>
          <DialogDescription>
            Adicione mais imagens ao empreendimento
          </DialogDescription>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col py-3 space-y-4 "
          >
            <Label htmlFor="chaves">Imagens deste modelo</Label>
            <Input
              id="imagens"
              type="file"
              multiple
              name="imagens"
              {...register("imagens")}
            />
            <Button size="sm" type="submit" disabled={loading}>
              {loading ? "Enviando..." : " Enviar imagens"}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AdicionarImagens;
