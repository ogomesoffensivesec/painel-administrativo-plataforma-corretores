import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { database } from "@/database/config/firebase";
import { ref, update } from "firebase/database";

export function ConfirmPayment({id, invoiceId}) {
  const updateInvoiceStatus = async () => {
    try {
      console.log(id);
      const invoiceRef = ref(database, `/empresas/${id}/invoices/${invoiceId}`);
      await update(invoiceRef, { paid: true });
      toast({
        title: "Status atualizado com sucesso!",
        description: "O status da conta a pagar foi atualizado com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao atualizar o status da conta a pagar:", error);
      toast({
        title: "Erro ao atualizar o status",
        description: "Ocorreu um erro ao atualizar o status da conta a pagar.",
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger>Confirmar pagamento</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deseja confirmar este pagamento?</DialogTitle>
        </DialogHeader>
        <DialogFooter bg="destructive">
          <Button type="button" onClick={updateInvoiceStatus} size="sm">
            Confirmar
          </Button>
          <DialogClose
            className="flex items-center justify-center gap-2 bg-destructive text-white px-3 text-xs rounded-md shadow-md cursor-pointer"
            onClick={() => console.log("Payment cancelled")}
          >
            Cancelar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
