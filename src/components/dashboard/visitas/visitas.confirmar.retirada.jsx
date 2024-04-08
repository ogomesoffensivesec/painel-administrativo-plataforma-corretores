"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../../ui/button";
import { get, ref, update } from "firebase/database";
import { database } from "@/database/config/firebase";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "react-query";
import { getVisits, visitInProgress } from "./visitas-data";

// const cancelarTemporizador = (timer) => {
//   if (timer) {
//     clearInterval(timer);
//   }
//   document.cookie =
//     "timerRunning=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
// };

function ConfirmarRetirada({
  id,
  open,
  setOpen,
  loading,
  setLoading,
  setTimer,
}) {
  const queryClient = useQueryClient();
  let timer;

  const confirmar = async () => {
    const referenciaDatabase = ref(database, `/visitas/${id}`);
    let visits = await getVisits();
    const visit = visits.find((visita) => visita.id === id);

    try {
      setLoading(true);
      let logAction = [];
      logAction.push({
        action: "Chaves retiradas",
        date: new Date().toISOString(),
      });

      const referenciaEmpreendimentos = ref(
        database,
        `/empreendimentos/${visit.realState.id}`
      );
      const snapshot = await get(referenciaEmpreendimentos);
      if (snapshot.exists()) {
        const empreendimento = snapshot.val();

        if (!empreendimento.chaves) {
          toast({
            title: "Chaves não definidas",
            description:
              "Este imóvel ainda não teve sua quantidade de chaves preenchida",
            variant: "destructive",
          });
          return;
        }
        await update(referenciaEmpreendimentos, {
          chaves: parseInt(visit.realState.chaves) - 1,
        });

        await update(referenciaDatabase, {
          log: logAction,
          status: "Chaves retiradas",
        });

        toast({
          title: "As chaves do imóvel foram retiradas pelo corretor",
          description: "Lembre-se: o tempo limite para visita é de 2 horas!",
          variant: "success",
        });

        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["visits"] });

        visitInProgress(visit);
      }
    } catch (error) {
      console.error(error.message);
      toast({
        title: "Erro ao confirmar retirada de chaves!",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
      // cancelarTemporizador(timer);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar retirada de chaves?</DialogTitle>
        </DialogHeader>
        <div className="w-full flex gap-5 justify-start items-center">
          <Button type="button" onClick={confirmar} disabled={loading}>
            {!loading && " Confirmar retirada das chaves"}
            {loading && "Confirmando..."}
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

export default ConfirmarRetirada;
