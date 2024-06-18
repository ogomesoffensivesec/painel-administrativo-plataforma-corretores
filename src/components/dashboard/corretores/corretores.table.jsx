"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";

import useUsers from "@/hooks/useUsers";
import PaginationComponent from "../empreendimentos/pagination";
import Detalhes from "./corretores.detalhes.dialog";

function TabelaCorretores() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const { fetchUsers, fetchUser } = useUsers();
  const [open, setOpen] = useState(false);

  const {
    data: corretores,
    isLoading,
    error,
  } = useQuery({
    refetchOnWindowFocus: true,
    staleTime: 10000,
    queryKey: ["corretores", name],
    queryFn: () => fetchUsers(name),
  });
  const handleOpenDetails = async (id) => {
    await fetchUser(id);
    setOpen(!open);
  };
  
  if (isLoading) return "Carregando resultados...";
  if (error) return "An error has occurred: " + error.message;
  let startIndex;
  let endIndex;
  let itemsOnPage;
  let totalCount;
  if (corretores && Object.keys(corretores).length > 0) {
    startIndex = (currentPage - 1) * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
    itemsOnPage = Object.values(corretores).slice(startIndex, endIndex);
    totalCount = Object.values(corretores).length + 1;
  }
  return (
    <div>
      {corretores && corretores.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Corretor</TableHead>
                <TableHead>Visitas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {corretores.map((corretor, i) => (
                <TableRow key={i}>
                  <TableCell className="capitalize">{corretor.name}</TableCell>
                  <TableCell>
                    {corretor.visitas &&
                      corretor.visitas.length + " visitas realizadas "}
                    {!corretor.visitas &&
                      "Este corretor ainda não realizou visitas"}
                  </TableCell>
                  <TableCell>
                    <Detalhes open={open} setOpen={setOpen} />
                    <Button
                      type="button"
                      onClick={() => handleOpenDetails(corretor.uid)}
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(
              Object.values(corretores).length / itemsPerPage
            )}
            onPageChange={setCurrentPage}
            totalCount={totalCount}
            itemsOnPage={itemsOnPage}
          />
        </>
      )}
      {!corretores && <span>0 corretores encontrados</span>}
    </div>
  );
}

export default TabelaCorretores;
