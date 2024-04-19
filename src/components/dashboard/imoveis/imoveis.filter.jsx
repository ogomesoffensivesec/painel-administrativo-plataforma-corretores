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
import { Search, SearchCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

export function ImoveisFilter() {
  const router = useRouter();
  const { register, handleSubmit, reset, rest } = useForm();
  const form = useForm();

  function handleFilterInvestiments(data) {
    const params = new URLSearchParams(router.query);
    const { name, type } = data;
    params.set("name", name.toLowerCase());
    params.set("type", type.toLowerCase());
    router.push(`/dashboard/imoveis/?${params.toString()}`);
  }

  function handleClearFilters() {
    const params = new URLSearchParams(router.query);
    const name = "";
    const type = "";

    params.set("name", name.toLowerCase());
    params.set("type", type.toLowerCase());
    router.push(`/dashboard/imoveis/?${params.toString()}`);
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
                  placeholder="Pesquisar imóvel..."
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
                  Tipo do imovel
                </option>
                <option className="cursor-pointer" value="casa">
                  Casa
                </option>
                <option className="cursor-pointer" value="casa">
                  Terreno
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
