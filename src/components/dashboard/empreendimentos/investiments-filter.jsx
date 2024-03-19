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

export function InvestimentsFilters() {
  const router = useRouter();
  const { register, handleSubmit, reset, rest } = useForm();
  const form = useForm();

  function handleFilterInvestiments(data) {
    const params = new URLSearchParams(router.query);
    const { name, type, status } = data;
    params.set("name", name.toLowerCase());
    params.set("type", type.toLowerCase());
    params.set("status", status.toLowerCase());
    router.push(`/dashboard/empreendimentos/?${params.toString()}`);
  }

  function handleClearFilters() {
    const params = new URLSearchParams(router.query);
    const name = "";
    const type = "";
    const status = "";
    params.set("name", name.toLowerCase());
    params.set("type", type.toLowerCase());
    params.set("status", status.toLowerCase());
    router.push(`/dashboard/empreendimentos/?${params.toString()}`);
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
                  placeholder="Nome do empreendimento"
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <select
                {...register("type")}
                {...rest}
                className="bg-gray-50 border border-gray-300 text-stone-700 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2  dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option className="cursor-pointer" value="">
                  Tipo do empreendimento
                </option>
                <option className="cursor-pointer" value="casa">
                  Casa
                </option>
                <option className="cursor-pointer" value="apartamento">
                  Apartamento
                </option>
                <option className="cursor-pointer" value="residencial">
                  Residencial
                </option>
              </select>
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
                className="bg-gray-50 border border-gray-300 text-stone-700 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2  dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option className="cursor-pointer" value="">
                  Status do empreendimento
                </option>
                <option className="cursor-pointer" value={true}>
                  Publicado
                </option>
                <option className="cursor-pointer" value={false}>
                  Não publicado
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
          <X size={15} />
        </Button>
      </form>
    </Form>
  );
}
