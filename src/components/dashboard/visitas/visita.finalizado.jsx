"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../../ui/button";
import { ref, set, update } from "firebase/database";
import { database } from "@/database/config/firebase";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "react-query";
import useUsers from "@/hooks/useUsers";

function FinalizarVisita({ id, open, setOpen, loading, setLoading, visit }) {
  const queryClient = useQueryClient();
  const { updateVisita } = useUsers();
  const finalizar = async () => {
    const referenciaDatabase = ref(database, `/visitas/${id}`);
    try {
      let logAction = [];
      if (visit.log) {
        logAction = visit.log;
      }
      logAction.push({
        action: "Visita realizada com sucesso",
        date: new Date().toISOString(),
      });

      visit.log = logAction;
      setLoading(true);
      await set(referenciaDatabase, visit);

      await update(referenciaDatabase, {
        finalizada: true,
      });
      await updateVisita(id, visit.corretor);

      toast({
        title: "Visita finalizada com sucesso!",
        description: "Acompanhe as negociações do corretor interessado!",
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["visits"] });
      setOpen(false);
    } catch (error) {
      console.error(error.message);
      toast({
        title: "Erro ao finalizar visita ao imóvel!",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar visita</DialogTitle>
        </DialogHeader>
        <div className="w-full flex gap-5 justify-start items-center">
          <Button type="button" onClick={finalizar} disabled={loading}>
            {!loading && "Finalizar visita ao imóvel"}
            {loading && "Finalizando..."}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FinalizarVisita;
