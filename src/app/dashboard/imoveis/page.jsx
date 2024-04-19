"use client";
import { ImoveisFilter } from "@/components/dashboard/imoveis/imoveis.filter";
import TabelaImoveis from "@/components/dashboard/imoveis/imoveis.table";
import NovoImovelDialog from "@/components/dashboard/imoveis/novo.imovel.dialog";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

// import { Container } from './styles';
const queryClient = new QueryClient();
function Imoveis() {
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <div className="w-full h-full dark:bg-stone-950 p-10">
          <div className="max-w-6xl mx-auto  space-y-4">
            <div className="flex items-center justify-between gap-2">
              <ImoveisFilter /> <NovoImovelDialog />
            </div>
            <div className="p-6 max-w-6xl mx-auto border rounded">
              <TabelaImoveis />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </Suspense>
  );
}

export default Imoveis;
