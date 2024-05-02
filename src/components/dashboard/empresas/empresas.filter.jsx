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

export function EmpresasFilter() {
  const router = useRouter();
  const { register, handleSubmit, reset, rest } = useForm();
  const form = useForm();

  function handleFilterInvestiments(data) {
    const params = new URLSearchParams(router.query);
    const { name } = data;
    params.set("name", name.toLowerCase());
    router.push(`/dashboard/empresas/?${params.toString()}`);
  }

  function handleClearFilters() {
    const params = new URLSearchParams(router.query);
    const name = "";

    params.set("name", name.toLowerCase());
    router.push(`/dashboard/empresas/?${params.toString()}`);
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
                  placeholder="Pesquisar empresa..."
                  {...field}
                  {...register("name")}
                />
              </FormControl>

              <FormMessage />
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
