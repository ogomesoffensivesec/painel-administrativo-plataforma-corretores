"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../../ui/button";
import { ref, update } from "firebase/database";
import { database } from "@/database/config/firebase";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "react-query";
import { getVisits } from "./visitas-data";
import { sendMessage } from "@/services/whatsapp.bot";

function ConfirmarRetirada({ id, open, setOpen, loading, setLoading, phone }) {
  const queryClient = useQueryClient();

  const confirmar = async () => {
    const referenciaDatabase = ref(database, `/visitas/${id}`);
    let visits = await getVisits();
    //const objetoFiltrado = listaDeObjetos.find(objeto => objeto.categoria === 'A');

    const visit = visits.find((visita) => visita.id === id);

    let timer;

    try {
      setLoading(true);
      let logAction = [];
      logAction.push({
        action: "Chaves retiradas",
        date: new Date().toISOString(),
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

      // Definindo um intervalo de 2 horas (em milissegundos)]
      //  2 * 60 * 60 * 1000;
      const tempoLimite = 5000;
      timer = setInterval(async () => {
        logAction.push({
          action: "Tempo da visita expirado!",
          date: new Date().toISOString(),
        });

        await update(referenciaDatabase, {
          log: logAction,
          expired: true,
        });

        sendMessage("11993420447");
        queryClient.invalidateQueries({ queryKey: ["visits"] });
        clearInterval(timer);
      }, tempoLimite);
    } catch (error) {
      console.error(error.message);
      toast({
        title: "Erro ao confirmar retirada de chaves!",
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
