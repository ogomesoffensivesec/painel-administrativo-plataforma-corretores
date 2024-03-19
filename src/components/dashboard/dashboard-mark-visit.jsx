"use client";

import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import useData from "@/hooks/useData";
import { getVisits, scheduleVisit } from "./visitas/visitas-data";

function DashboardVisit() {
  const { getInvestiments, encontrarItemPorId } = useData();
  const [realStates, setRealStates] = useState([]);
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
      const data = await getInvestiments();
      setRealStates(data);
    };

    fetchRealStates();
  }, [loading]);

  const onSubmit = async (data) => {
    const { realState } = data;
    const isMissingFields =
      !data.realState ||
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
      await scheduleVisit(data);
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
    <div className="w-full h-16 flex flex-col py-2 space-y-3 mb-10 ">
      <span className="text-xl font-bold text-stone-800 dark:text-white">
        Agendar visita ao imóvel
      </span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col  gap-2 w-full mt-3">
          <Label htmlFor="real-state" className="text-left w-auto ">
            Por favor, selecione o imóvel que deseja visitar.
          </Label>
          <div className="w-full flex gap-3">
            <select
              id="real-state"
              {...register("realState")}
              className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Selecione...</option>
              {Object.values(realStates).map((state) => (
                <option key={state.nome} value={JSON.stringify(state)}>
                  {state.nome}
                </option>
              ))}
            </select>
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
              className="flex h-9 w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            {!available && (
              <Button className={`w-[200px] `} disabled={loading}>
                {loading && "Verificando..."}

                {!loading && !available && "Verificar disponibilidade"}
              </Button>
            )}
            {available && (
              <Button
                className={`w-[200px] bg-emerald-600 hover:bg-emerald-800`}
              >
                Agendar?
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default DashboardVisit;
