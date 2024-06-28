import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import useUsers from "@/hooks/useUsers";
import { v4 } from "uuid";
import { onValue, ref } from "firebase/database";
import { database } from "@/database/config/firebase";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { getVisits, scheduleVisit } from "./visitas/visitas-data";

function DashboardVisit() {
  const [realStates, setRealStates] = useState([]);
  const { users } = useUsers();
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    const fetchRealStates = async () => {
      const referenciaEmpreendiemtnos = ref(database, `/empreendimentos`);
      await onValue(referenciaEmpreendiemtnos, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          setRealStates(Object.values(data));
        } else {
        }
      });
    };

    fetchRealStates();
  }, [loading]);

  const onSubmit = async (data) => {
    const { realState } = data;
    const isMissingFields =
      !data.realState ||
      !data.corretor ||
      !data.scheduled_day ||
      !data.scheduled_month ||
      !data.scheduled_hour;

    if (isMissingFields) {
      toast({
        title: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (available) {
      const visitId = v4();
      await scheduleVisit(visitId, data);
      reset();
      setAvailable(false);
    } else {
      const visits = await getVisits(
        realState.nome,
        data.scheduled_day,
        data.scheduled_month,
        data.scheduled_hour
      );

      if (visits.length === 0) {
        setAvailable(true);
        return;
      } else {
        toast({
          title: "Este horário já foi reservado!",
          description: "Selecione outra data ou horário!",
          variant: "destructive",
        });
        return;
      }
    }
  };

  const diasDoMes = Array.from({ length: 31 }, (_, index) => index + 1);

  const mesesDoAno = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  let horarios = [];

  for (let hora = 9; hora < 17; hora++) {
    for (let minuto of [0, 30]) {
      horarios.push(
        `${hora.toString().padStart(2, "0")}:${minuto
          .toString()
          .padStart(2, "0")}`
      );
    }
  }
  return (
    <div className="w-full flex flex-col py-2 space-y-3  ">
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full  flex flex-col  ">
          <div className="flex flex-col  gap-2 w-full ">
            <div className="w-full flex flex-col gap-3">
              <select
                id="real-state"
                {...register("realState")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Selecione...</option>
                {Object.values(realStates).map((state) => (
                  <option key={state.id} value={JSON.stringify(state)}>
                    {state.nome}
                  </option>
                ))}
              </select>
              {users && Object.values(users).length > 0 && (
                <select
                  id="corretor"
                  {...register("corretor")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  {Object.values(users).map((user) => (
                    <option key={user.uid} value={user.uid}>
                      {user.name}
                    </option>
                  ))}
                </select>
              )}
              <div className="w-full flex gap-3 justify-start items-center ">
                <select
                  id="scheduled_day"
                  {...register("scheduled_day")}
                  className="flex h-9 w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Dia</option>
                  {diasDoMes.map((dia) => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </select>
                <select
                  id="scheduled_month"
                  {...register("scheduled_month")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Mês</option>
                  {mesesDoAno.map((mes, index) => (
                    <option className="capitalize" key={mes} value={index + 1}>
                      {mes}
                    </option>
                  ))}
                </select>
                <select
                  id="scheduled_hour"
                  {...register("scheduled_hour")}
                  className="flex h-9 w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Horário</option>
                  {horarios.map((hora) => (
                    <option className="capitalize" key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
       <div className="w-full flex justify-end">
       {!available && (
          <Button size="sm" className={`w-[200px] mt-4`} disabled={loading}>
            {loading && "Verificando..."}
            {!loading && !available && "Verificar disponibilidade"}
          </Button>
        )}
        {available && (
          <Button
            size="sm"
            className={`w-[200px] bg-emerald-600 hover:bg-emerald-800`}
          >
            Agendar?
          </Button>
        )}
       </div>
      </form>
    </div>
  );
}

export default DashboardVisit;
