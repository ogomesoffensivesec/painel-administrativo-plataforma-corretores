"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PlusIcon } from "lucide-react";
import { InserirCompromisso } from "./_components/inserir-compromissos";
import { TabelaCompromissos } from "./_components/compromissos-table";

export default function CompromissosFinanceiros() {
  return (
    <div className="w-full h-screen">
      <div className="w-full  py-5  px-12 flex justify-start gap-8 border-b-[1px] border-border shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/financeiro">
                Financeiro
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className='text-blue-600 font-medium'>Compromissos financeiros</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="p-8 space-y-4">
        <div className="w-full flex items-center justify-between  ">
          <div className="grid leading-relaxed">
            <span className="font-bold text-2xl text-blue-600">
              Controle Financeiro
            </span>
            <span className="text-muted-foreground">
              Consulte, realize e informe as suas operações financeiras
            </span>
          </div>
          <div className="flex gap-2">
            <InserirCompromisso type="button">
              <PlusIcon className="h-4 w-4 mr-3" />
              Incluir compromisso
            </InserirCompromisso>
          </div>
        </div>
        <TabelaCompromissos />
      </div>
    </div>
  );
}
