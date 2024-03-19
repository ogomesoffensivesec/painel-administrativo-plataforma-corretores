"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { toast } from "../../ui/use-toast";
import { PlusCircle } from "lucide-react";
import useData from "@/hooks/useData";
import { getVisits, scheduleVisit } from "./visitas-data";
import useUsers from "@/hooks/useUsers";
import { useQueryClient } from "react-query";
import { v4 } from "uuid";

function NewVisitDialog() {
  const [realStates, setRealStates] = useState([]);
  const { getInvestiments } = useData();
  const { users } = useUsers();
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    const fetchRealStates = async () => {
      const data = await getInvestiments();
      setRealStates(data);
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
      queryClient.invalidateQueries({ queryKey: ["visits"] });

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
    <Dialog>
      <DialogTrigger className="h-9 px-3  border-none outline-none w-[200px] bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-1 justify-center items-center text-sm">
        <PlusCircle size={14} className="mr-1" />
        Agendar visita
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Visita</DialogTitle>
          <DialogDescription>
            {" "}
            Por favor, selecione o imóvel que deseja visitar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full h-16 flex flex-col  ">
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
                      <option
                        className="capitalize"
                        key={mes}
                        value={index + 1}
                      >
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
          <DialogFooter className="mt-24">
            {!available && (
              <Button size="sm" className={`w-[200px] `} disabled={loading}>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewVisitDialog;
