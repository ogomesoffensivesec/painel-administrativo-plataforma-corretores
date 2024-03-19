import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { cancelVisit } from "./visitas-data";
import { useRouter } from "next/navigation";
import { useQueryClient } from "react-query";

function ConfirmCancelVisitDialog({ visit }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleCancelVisit = async () => {
    await cancelVisit(visit, router);
    queryClient.invalidateQueries({ queryKey: ["visits"] });
  };
  return (
    <Dialog>
      <DialogTrigger className=" w-[120px] bg-red-600 inline-flex items-center justify-center whitespace-nowrap rounded-md  font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-3 py-1 text-xs text-white">
        <PlusCircle size={14} className="mr-1" />
        Cancelar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Confirmar o cancelamento da visita ao imóvel?
          </DialogTitle>
          <DialogDescription>
            Confirmação de cancelamento da visita do imóvel
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex gap-2 items-center justify-center">
          <DialogClose>
            <Button>Não</Button>
          </DialogClose>

          <DialogClose>
            <Button
              variant="destructive"
              onClick={() => handleCancelVisit(visit)}
            >
              Sim, quero cancelar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmCancelVisitDialog;
