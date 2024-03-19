"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getVisits } from "./visitas-data";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "react-query";
import { Button } from "@/components/ui/button";
import PaginationComponent from "../empreendimentos/pagination";
import ConfirmCancelVisitDialog from "./visitas-confirm-cancel-dialog";
import ConfirmarRetirada from "./visitas.confirmar.retirada";
import FinalizarVisita from "./visita.finalizado";
import VisitLogger from "./visit.logger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";
import { sendMessage } from "@/services/whatsapp.bot";

function TabelaVisitas() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(15);
  const queryClient = useQueryClient();
  const [ativo, setAtivo] = useState(false);

  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    let interval = null;
    if (ativo) {
      interval = setInterval(() => {
        setSegundos((segundos) => segundos + 1);
      }, 1000);
    } else if (!ativo && segundos !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [ativo, segundos]);

  const searchParams = useSearchParams();
  const realState = searchParams.get("realState");
  const scheduled_hour = searchParams.get("scheduled_hour");
  const scheduled_day = searchParams.get("scheduled_day");
  const scheduled_month = searchParams.get("scheduled_month");
  const finalizada = searchParams.get("finalizada");
  const [selectedId, setSelectedId] = useState("");
  const [open, setOpen] = useState(false);
  const [openFinalizar, setOpenFinalizar] = useState(false);
  const {
    data: visits,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "visits",
      realState,
      scheduled_day,
      scheduled_month,
      scheduled_hour,
      finalizada,
    ],
    queryFn: () =>
      getVisits(
        realState,
        scheduled_day,
        scheduled_month,
        scheduled_hour,
        finalizada
      ),
  });

  if (isLoading) return "Carregando resultados...";
  if (error) return "An error has occurred: " + error.message;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsOnPage = visits.slice(startIndex, endIndex);
  const totalCount = visits.length + 1;

  const selecionarConfirmar = (id) => {
    setSelectedId(id);
    setOpen(true);
  };
  const selecionarFinalizar = (id) => {
    setSelectedId(id);
    setOpenFinalizar(true);
  };

  return (
    <div className="w-full">
      {visits.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Corretor</TableHead>

                {/* <TableHead>Cliente</TableHead> */}
                <TableHead>Data/Hora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {itemsOnPage.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="capitalize">
                    {visit["realState"].nome}
                  </TableCell>
                  <TableCell className="capitalize">
                    {visit["realState"].type}
                  </TableCell>
                  <TableCell className="capitalize">
                    {visit["corretor"].name}
                  </TableCell>
                  {/* <TableCell className="capitalize">
                    {visit.client.fullName}
                  </TableCell> */}
                  <TableCell className="capitalize">
                    {visit.scheduled_date} - {visit.scheduled_hour}
                  </TableCell>

                  <TableCell>
                    {!visit.expired && !visit.finalizada && visit.status}
                    {visit.finalizada && "Visita realizada com sucesso"}
                    {visit.expired && !visit.finalizada && (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Badge size="lg" variant="analysis">
                            Tempo de visita expirado <br /> Clique aqui
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel
                            className="flex gap-2 py-4  text-xs items-center justify-start select-none"
                            onClick={() => {
                              sendMessage("11993420447");
                            }}
                          >
                            <Send size={12} /> Enviar mensagem
                          </DropdownMenuLabel>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                  <TableCell className="flex flex-col justify-center items-center gap-2">
                    <ConfirmarRetirada
                      open={open}
                      loading={loading}
                      id={selectedId}
                      setOpen={setOpen}
                      setLoading={setLoading}
                      phone={visit.corretor.phone}
                    />
                    <FinalizarVisita
                      open={openFinalizar}
                      setOpen={setOpenFinalizar}
                      loading={loading}
                      id={selectedId}
                      setLoading={setLoading}
                      visit={visit}
                    />

                    {!visit.finalizada && (
                      <>
                        {visit.status === "Aguardando retirada de chaves" && (
                          <Button
                            onClick={() => selecionarConfirmar(visit.id)}
                            size="xs"
                            className="text-xs px-3 py-1 w-[120px]"
                          >
                            Confirmar retirada
                          </Button>
                        )}
                        {visit.status === "Chaves retiradas" && (
                          <Button
                            onClick={() => selecionarFinalizar(visit.id)}
                            size="xs"
                            className="text-xs px-3 py-1 w-[120px]"
                          >
                            Finalizar visita
                          </Button>
                        )}
                        <ConfirmCancelVisitDialog visit={visit} />
                      </>
                    )}
                    <VisitLogger visit={visit} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(visits.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalCount={totalCount}
            itemsOnPage={itemsOnPage}
          />
        </>
      )}
      {visits.length === 0 && <span>0 visitas encontradas</span>}
    </div>
  );
}

export default TabelaVisitas;
