import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { database, storage } from "@/database/config/firebase";
import useData from "@/hooks/useData";
import { ref, set, push, get } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";

function AdicionarDocumentos({
  empreendimentoId,
  modeloId,
  modelo,
  modeloIndex,
}) {
  const { handleSubmit, register } = useForm();
  const { addNewImagesToModel, counter } = useData();
  const [loading, setLoading] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [newNames, setNewNames] = useState({});

  const handleDocumentos = (event) => {
    const fileList = event.target.files;
    const newArquivos = Array.from(fileList).map((file) => file);
    setDocumentos([...documentos, ...newArquivos]);
  };

  const handleRenameChange = (documentoId, newName) => {
    setNewNames({ ...newNames, [documentoId]: newName });
  };

  async function enviarArquivosParaStorage() {
    const objetosComURLs = [];

    for (let i = 0; i < documentos.length; i++) {
      const arquivo = documentos[i];
      const nome = newNames[i];
      const id = v4();
      try {
        const referencia = storageRef(
          storage,
          `empreendimentos/${empreendimentoId}/modelos/${modeloId}/documentos/${id}`
        );
        await uploadBytes(referencia, arquivo);

        const url = await getDownloadURL(referencia);

        const objeto = {
          url,
          name: nome,
          id,
        };

        objetosComURLs.push(objeto);
      } catch (error) {
        console.error(`Erro ao enviar o arquivo ${nome}:`, error);
      }
    }

    return objetosComURLs;
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const novosObjetosEnviados = await enviarArquivosParaStorage();

      const referencia = ref(
        database,
        `/empreendimentos/${empreendimentoId}/modelos/${modeloIndex}/documentos`
      );

      // Obtendo a lista atual de documentos (se existir) do banco de dados
      const snapshot = await get(referencia);
      const documentosAtuais = snapshot.exists() ? snapshot.val() : [];

      // Adicionando os novos objetos enviados à lista atual de documentos
      const documentosAtualizados = [
        ...documentosAtuais,
        ...novosObjetosEnviados,
      ];

      // Enviando a lista atualizada para o banco de dados
      await set(referencia, documentosAtualizados);

      toast({
        title: "Novos documentos adicionados ao modelo",
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao adicionar novos documentos:", error);
    } finally {
      setLoading(false);
      setDocumentos([]);
      setNewNames({});
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="h-8 mx-3 text-xs  border-none outline-none w-[200px] bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-2 justify-center items-center">
        <Upload size={14} color="white" /> Adicionar documentos
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar documentos</DialogTitle>
          <DialogDescription>
            Adicione mais documentos ao empreendimento
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col py-3 space-y-4 "
        >
          <ScrollArea className="h-64 w-full rounded-md border space-y-4">
            {documentos.map((documento, index) => (
              <div key={index} className="flex flex-col text-xs gap-2">
                <div>
                  <span>Nome atual do arquivo:</span>
                  <span>{documento.name}</span>
                </div>

                <Input
                  type="text"
                  placeholder="Novo nome"
                  onChange={(e) => handleRenameChange(index, e.target.value)}
                />
              </div>
            ))}
            <Label htmlFor="documentos">Documentos deste modelo</Label>
            <Input
              id="documentos"
              type="file"
              multiple
              name="documentos"
              {...register("documentos")}
              onChange={handleDocumentos}
            />
          </ScrollArea>

          <DialogFooter>
            <Button size="sm" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar documentos"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdicionarDocumentos;
