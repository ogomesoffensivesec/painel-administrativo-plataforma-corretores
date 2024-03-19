import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,

  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function CancelNegotiationDialog() {
  return (
    <Dialog>
      <DialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2">
        Desistir da negociação
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desistir da negociação?</DialogTitle>
          <DialogDescription>
            Tenha certeza do cancelamento, essa ação não poderá ser desfeita
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex gap-2 items-center justify-center">
<DialogClose>
<Button>Não</Button>
</DialogClose>

          <Button variant="destructive">Sim, quero desistir</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CancelNegotiationDialog;
