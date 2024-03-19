import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useData from "@/hooks/useData";

function CompartilharCorretores() {
  const { publicarEmpreendimento, empreendimento } = useData();

  const handlePublicarEmpreendimento = async () => {
    await publicarEmpreendimento({ empreendimento });
    return;
  };
  return (
    <Dialog>
      <DialogTrigger className="relative flex  w-full  cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 justify-between">
        Plataforma Corretores
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar na plataforma de corretores</DialogTitle>
          <DialogDescription>
            Você pode desfazer essa ação a qualquer momento
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex gap-12 items-center justify-center mt-2">
          <DialogClose>Cancelar</DialogClose>
          <Button type="button" onClick={handlePublicarEmpreendimento}>
            Publicar empreendimento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CompartilharCorretores;
