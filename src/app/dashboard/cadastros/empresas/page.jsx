"use client";
import { EmpresasFilter } from "@/components/dashboard/empresas/empresas.filter";
import TabelaEmpresas from "@/components/dashboard/empresas/empresas.table";
import NovaEmpresa from "@/components/dashboard/empresas/nova.empresa";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
function Empresas() {
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <div className="w-full h-full dark:bg-stone-950 p-10">
          <div className="max-w-6xl mx-auto  space-y-4">
            <div className="flex items-center justify-between gap-2">
              <EmpresasFilter /> <NovaEmpresa />
            </div>
            <div className="p-6 max-w-6xl mx-auto border rounded">
              <TabelaEmpresas />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </Suspense>
  );
}

export default Empresas;
