"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

export function ClientsFilters() {
  const router = useRouter();
  const { register, handleSubmit, reset, rest } = useForm();
  const form = useForm();

  function handleFilterInvestiments(data) {
    const params = new URLSearchParams(router.query);
    const { name, status } = data;
    console.log(`Status: ${status}`);
    params.set("name", name);
    params.set("status", status);
    router.push(`/dashboard/meus-clientes/?${params.toString()}`);
  }

  function handleClearFilters() {
    const params = new URLSearchParams(router.query);
    const name = "";
    const status = "";
    params.set("name", name.toLowerCase());
    params.set("status", status.toLowerCase());
    router.push(`/dashboard/meus-clientes/?${params.toString()}`);
    reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleFilterInvestiments)}
        className="flex items-center  justify-start gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Nome completo"
                  {...field}
                  {...register("name")}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <select
                {...register("status")}
                {...rest}
                className=        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

              >
                <option className="cursor-pointe" value="">
                  Status do cliente
                </option>
                <option className="cursor-pointer" value={'active'}>
                  Disponível
                </option>
                <option className="cursor-pointer" value={'inactive'}>
                  Indisponível
                </option>
              </select>
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary">
          <Search className="w-4 h-4 mr-2" />
          Filtrar resultados
        </Button>
        <Button
          variant="secondary"
          className=" bg-red-600 dark:bg-red-700 p-3 hover:bg-red-900 dark:hover:bg-red-900 text-white"
          onClick={handleSubmit(handleClearFilters)}
        >
          <X size={18} />
        </Button>
      </form>
    </Form>
  );
}
