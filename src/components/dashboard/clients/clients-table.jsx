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
import { getClients } from "./clients-data";
import { useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import PaginationComponent from "../empreendimentos/pagination";
import ClientDetails from "./client-details";

function ClientTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const status = searchParams.get("status");

  const {
    data: clients,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clients", name, status],
    queryFn: () => getClients(name, status),
  });

  if (isLoading) return "Carregando resultados...";
  if (error) return "An error has occurred: " + error.message;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsOnPage = clients.slice(startIndex, endIndex);
  const totalCount = clients.length + 1;
  //empreendimento: "empreendimento 10",
  //bairro: 'Centro',
  //type: "casa",
  //preço: 910200.75,
  //status
  return (
    <div>
      {clients.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Negociações ativas</TableHead>
                <TableHead>Ações</TableHead>
                {/*
        <TableHead>Preço</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Ações</TableHead>
        */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {itemsOnPage.map((client, i) => (
                <TableRow key={i}>
                  <TableCell className="capitalize">
                    {client.fullName}
                  </TableCell>
                  <TableCell className="capitalize">
                    {client.status === "active" ? "Ativo" : "Inativo"}
                  </TableCell>
                  <TableCell className="capitalize">{client.addr}</TableCell>
                  <TableCell>
                    {client.active_conversation > 1 &&
                      `${client.active_conversation} negociações ativas`}
                    {client.active_conversation === 1 &&
                      `${client.active_conversation} negociação ativa`}
                  </TableCell>

                  <TableCell>
         
                      <ClientDetails  client={client}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(clients.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalCount={totalCount}
            itemsOnPage={itemsOnPage}
          />
        </>
      )}
      {clients.length === 0 && <span>0 empreendimentos encontrados</span>}
    </div>
  );
}

export default ClientTable;
