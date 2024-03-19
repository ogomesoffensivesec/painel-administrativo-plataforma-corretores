"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useData from "@/hooks/useData";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

export function VisitasFilters() {
  const [loading, setLoading] = useState(false);
  const { empreendimentos } = useData();

  const router = useRouter();
  const { register, handleSubmit, reset, rest } = useForm();
  const form = useForm();

  function handleFilterInvestiments(data) {
    const params = new URLSearchParams(router.query);
    const {
      realState,
      scheduled_day,
      scheduled_month,
      scheduled_hour,
      finalizada,
    } = data;

    params.set("realState", realState.toLowerCase());
    params.set("scheduled_day", scheduled_day.toLowerCase());
    params.set("scheduled_month", scheduled_month.toLowerCase());
    params.set("finalizada", finalizada);
    params.set("scheduled_hour", encodeURIComponent(scheduled_hour)); // Codificando a hora antes de adicioná-la à URL
    router.push(`/dashboard/visitas/?${params.toString()}`);
  }

  function handleClearFilters() {
    const params = new URLSearchParams(router.query);
    const realState = "";
    const scheduled_day = "";
    const scheduled_month = "";
    const scheduled_hour = "";
    const finalizada = false;
    params.set("realState", realState.toLowerCase());
    params.set("scheduled_day", scheduled_day.toLowerCase());
    params.set("scheduled_month", scheduled_month.toLowerCase());
    params.set("scheduled_hour", scheduled_hour.toLowerCase());
    params.set("finalizada", finalizada);
    router.push(`/dashboard/visitas/?${params.toString()}`);
    reset();
  }

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
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleFilterInvestiments)}
        className="flex items-center  justify-start gap-2"
      >
        <select
          id="real-state"
          {...register("realState")}
          className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Selecione...</option>
          {Object.values(empreendimentos).map((state) => (
            <option key={state.id} value={state.nome}>
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
        <select
          id="finalizada"
          {...register("finalizada")}
          className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Status</option>
          <option value="yes">Finalizadas</option>
          <option value="no">Em andamento</option>
        </select>
        <Button type="submit" variant="secondary">
          <Search className="w-4 h-4 mr-2" />
          Filtrar resultados
        </Button>
        <Button
          variant="secondary"
          className=" bg-red-600 dark:bg-red-700 p-3 hover:bg-red-900 dark:hover:bg-red-900 text-white"
          onClick={handleSubmit(handleClearFilters)}
        >
          <X size={15} />
        </Button>
      </form>
    </Form>
  );
}
