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

import PaginationComponent from "./pagination";
import useData from "@/hooks/useData";
import DocumentosEmpreendimento from "./empreendimento.documentos";

function TabelaInvestimentos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const route = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const { getInvestiments, encontrarItemPorId } = useData();
  const [selectedId, setSelectedId] = useState();
  const [loading, setLoading] = useState(false);

  const {
    data: investiments,
    isLoading,
    error,
  } = useQuery({
    refetchOnWindowFocus: true,
    staleTime: 10000,
    queryKey: ["investiments", name, type],
    queryFn: () => getInvestiments(name, type),
  });

  if (isLoading) return "Carregando resultados...";
  if (error) return "An error has occurred: " + error.message;
  let startIndex;
  let endIndex;
  let itemsOnPage;
  let totalCount;
  if (investiments && Object.keys(investiments).length > 0) {
    startIndex = (currentPage - 1) * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
    itemsOnPage = Object.values(investiments).slice(startIndex, endIndex);
    totalCount = Object.values(investiments).length + 1;
  }
  return (
    <div>
      {investiments && Object.values(investiments).length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empreendimento</TableHead>
                <TableHead>Tipo do empreendimento</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
                <TableHead>Documentação</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Object.values(investiments).map((investiment, i) => (
                <TableRow key={i}>
                  <TableCell className="capitalize">
                    {investiment.nome}
                  </TableCell>
                  <TableCell className="capitalize">
                    {investiment.type}
                  </TableCell>
                  <TableCell className="capitalize">
                    {investiment.bairro}
                  </TableCell>
                  {/* <TableCell className="capitalize">
                    {investiment.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell> */}
                  <TableCell className="capitalize">
                    {investiment.modelos && investiment.modelos[0].price}
                  </TableCell>
                  <TableCell className="capitalize">
                    {investiment.publicado ? "Publicado" : "Não publicado"}
                  </TableCell>
                  <TableCell>
                    <Button
                      disabled={loading && selectedId === investiment.id}
                      className="h-8  px-3 w-[150px]"
                      onClick={async () => {
                        try {
                          setLoading(true);
                          setSelectedId(investiment.id);
                          await encontrarItemPorId(investiment.id);
                          await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                          );
                          route.push(`empreendimentos/${investiment.id}`);
                        } catch (error) {
                          console.log(error.message);
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      {loading && selectedId === investiment.id
                        ? "Carregando..."
                        : "Detalhes"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DocumentosEmpreendimento
                      empreendimento={investiment}
                      documentos={investiment.documentos}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(
              Object.values(investiments).length / itemsPerPage
            )}
            onPageChange={setCurrentPage}
            totalCount={totalCount}
            itemsOnPage={itemsOnPage}
          />
        </>
      )}
      {!investiments ||
        (investiments.length === 0 && (
          <span>0 empreendimentos encontrados</span>
        ))}
    </div>
  );
}

export default TabelaInvestimentos;
