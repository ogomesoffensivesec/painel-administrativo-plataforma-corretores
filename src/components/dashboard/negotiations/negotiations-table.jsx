"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getNegotiations } from "./negotiations-data";
import { useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import PaginationComponent from "../empreendimentos/pagination";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

function NegotiationsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const status = searchParams.get("status");

  const router = useRouter();
  const linkToPage = (negotiation) => {
    setLoading(true);
    router.push(`/dashboard/negociacoes/${negotiation.id}`);
    setLoading(false);
  };
  const {
    data: negotiations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["negotiations", name, status],
    queryFn: () => getNegotiations(name, status),
  });

  if (isLoading) return "Carregando resultados...";
  if (error) return "An error has occurred: " + error.message;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsOnPage = negotiations.slice(startIndex, endIndex);
  const totalCount = negotiations.length + 1;
  //empreendimento: "empreendimento 10",
  //bairro: 'Centro',
  //type: "casa",
  //preço: 910200.75,
  //status
  return (
    <div>
      {negotiations.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Empreendimento</TableHead>
                <TableHead>Última atualização</TableHead>
                <TableHead>Ações</TableHead>

                {/*          
        <TableHead>Preço</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Ações</TableHead>
   */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {itemsOnPage.map((negotiation, i) => (
                <TableRow key={i}>
                  <TableCell className="capitalize">
                    {negotiation.client.fullName}
                  </TableCell>
                  <TableCell className="capitalize">
                    {negotiation.status ? "Ativo" : "Inativo"}
                  </TableCell>
                  <TableCell className="capitalize">
                    {negotiation["real-state"].empreendimento}
                  </TableCell>
                  <TableCell>{negotiation.createdAt}</TableCell>

                  <TableCell>
                    <Button
                      className="h-8  px-6"
                      onClick={() => linkToPage(negotiation)}
                    >
                      {loading ? <Progress /> : "Detalhes"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(negotiations.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalCount={totalCount}
            itemsOnPage={itemsOnPage}
          />
        </>
      )}
      {negotiations.length === 0 && <span>0 empreendimentos encontrados</span>}
    </div>
  );
}

export default NegotiationsTable;
