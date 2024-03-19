import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import useData from "@/hooks/useData";

function EditarEmpreendimento() {
  const { excluirEmpreendimento } = useData();

  return (
    <Dialog>
      <DialogTrigger className="relative flex  w-full  cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 justify-between">
        Editar empreendimento
        <Pencil size={16} className="text-blue-500" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você tem certeza?</DialogTitle>
          <DialogDescription>
            Essa ação não poderá ser desfeita após a confirmação.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex gap-2 items-center justify-center mt-2">
          <Button variant="destructive" onClick={excluirEmpreendimento}>
            Sim, apagar.
          </Button>
          <Button variant="ghost">Não, cancelar.</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditarEmpreendimento;
