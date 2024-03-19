import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { database } from "@/database/config/firebase";
import { ref, update } from "firebase/database";

import React from "react";
import { useForm } from "react-hook-form";

// import { Container } from './styles';

function VerificarChaves({ open, id, setOpen }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    console.log("Definindo chaves");
    const referenciaEmpreendimento = ref(database, `/empreendimentos/${id}`);
    try {
      await update(referenciaEmpreendimento, {
        chaves: data.chaves,
      });
      toast({
        title: "Chaves definidas com sucesso",
        description: "Agora você pode realizar visitas ao imóvel",
        variant: "success",
      });
      setOpen(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Defina a quantidade de chaves</DialogTitle>
          <DialogDescription>
            Você ainda não definiu a quantidade de chaves deste imóvel
          </DialogDescription>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col py-3 space-y-4 "
          >
            <Label htmlFor="chaves">Chaves do empreendimento</Label>
            <Input
              id="chaves"
              type="number"
              min="0"
              max="100"
              name="chaves"
              {...register("chaves")}
            />
            <Button size="sm" type="submit">
              Definir chaves
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default VerificarChaves;
