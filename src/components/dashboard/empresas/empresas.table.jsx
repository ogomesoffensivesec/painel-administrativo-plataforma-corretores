"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import PaginationComponent from "../empreendimentos/pagination";
import { getEmpresas } from "./empresas.data";
import DocumentosEmpresa from "./empresa.documentos";

function TabelaEmpresas() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const searchParams = useSearchParams();

  const {
    data: empresas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["empresas"],
    queryFn: () => getEmpresas(),
  });

  if (isLoading) return "Carregando resultados...";
  if (error) return "An error has occurred: " + error.message;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsOnPage = empresas.slice(startIndex, endIndex);
  const totalCount = empresas.length + 1;
  return (
    <div className="w-full">
      {empresas.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razão social</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-center">Documentação</TableHead>
                <TableHead>Informações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {itemsOnPage.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell className="capitalize">
                    {empresa.razaoSocial}
                  </TableCell>
                  <TableCell className="capitalize">{empresa.cnpj}</TableCell>
                  <TableCell className="flex justify-center">
                    <DocumentosEmpresa
                      documentos={empresa.documentos && empresa.documentos}
                      empresa={empresa}
                    />
                  </TableCell>
                  <TableCell>{}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(empresas.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalCount={totalCount}
            itemsOnPage={itemsOnPage}
          />
        </>
      )}
      {empresas.length === 0 && <span>0 empresas encontradas</span>}
    </div>
  );
}

export default TabelaEmpresas;
