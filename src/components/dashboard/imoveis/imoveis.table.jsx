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
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import PaginationComponent from "../empreendimentos/pagination";
import { getImoveis } from "./imoveis.data";
import { Button } from "@/components/ui/button";
import DocumentosImovel from "./imovel.documentos";
import InfosImoveis from "./imoveis.infos";

function TabelaImoveis() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const searchParams = useSearchParams();
  const {
    data: imoveis,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["imoveis"],
    queryFn: () => getImoveis(),
  });

  if (isLoading) return "Carregando resultados...";
  if (error) return "An error has occurred: " + error.message;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsOnPage = imoveis.slice(startIndex, endIndex);
  const totalCount = imoveis.length + 1;
  const router = useRouter();
  return (
    <div className="w-full">
      {imoveis.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Documentação</TableHead>
                <TableHead>Informações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {itemsOnPage.map((imovel) => (
                <TableRow key={imovel.id}>
                  <TableCell className="capitalize">{imovel.nome}</TableCell>
                  <TableCell className="capitalize">{imovel.type}</TableCell>
                  <TableCell className="flex justify-center">
                    <DocumentosImovel
                      documentos={imovel.documentos}
                      imovel={imovel}
                    />
                  </TableCell>
                  <TableCell>
                    <InfosImoveis imovel={imovel} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(imoveis.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalCount={totalCount}
            itemsOnPage={itemsOnPage}
          />
        </>
      )}
      {imoveis.length === 0 && <span>0 imoveis encontrados</span>}
    </div>
  );
}

export default TabelaImoveis;
