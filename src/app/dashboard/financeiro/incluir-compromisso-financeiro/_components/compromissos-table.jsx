'use client'
import React, { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { database } from "@/database/config/firebase";
import { File } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Link from "next/link";
import { empresas } from "./inserir-compromissos";

export function TabelaCompromissos() {
  const [compromissos, setCompromissos] = useState([]);
  const [filteredCompromissos, setFilteredCompromissos] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  useEffect(() => {
    const databaseRef = ref(database, "/compromissos");
    const handleDataChange = (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        setCompromissos(data);
        setFilteredCompromissos(data);
      } else {
        setCompromissos([]);
        setFilteredCompromissos([]);
      }
    };

    onValue(databaseRef, handleDataChange);

    return () => {
      off(databaseRef, "value", handleDataChange);
    };
  }, []);

  useEffect(() => {
    let filtered = compromissos;

    if (statusFilter) {
      filtered = filtered.filter(
        (compromisso) => compromisso.status === statusFilter
      );
    }

    if (companyFilter) {
      filtered = filtered.filter(
        (compromisso) =>
          compromisso.business === companyFilter || companyFilter === "Nenhum"
      );
    }

    if (startDateFilter && endDateFilter) {
      filtered = filtered.filter((compromisso) => {
        const compromissoDate = new Date(compromisso.expiredDate);
        const startDate = new Date(startDateFilter);
        const endDate = new Date(endDateFilter);

        return compromissoDate >= startDate && compromissoDate <= endDate;
      });
    }

    setFilteredCompromissos(filtered);
  }, [statusFilter, companyFilter, startDateFilter, endDateFilter, compromissos]);

  return (
    <div className="grid gap-4">
      <div className="py-3 text-sm">
        <span className="font-medium">Filtrar tabela</span>
        <div className="flex gap-3">
          <Select onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={true}>Pago</SelectItem>
              <SelectItem value={false}>Pendente</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filtrar por empresa" />
            </SelectTrigger>
            <SelectContent>
              {empresas.map((empresa) => (
                <SelectItem value={empresa.razaoSocial} key={empresa.id}>
                  {empresa.razaoSocial}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="date"
            className="border rounded px-2 py-1"
            placeholder="Filtrar por data de início"
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            placeholder="Filtrar por data final"
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </div>
      </div>
      <Table>
        <TableCaption>Lista de compromissos do dia</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Arquivo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Usuário</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompromissos.map((compromisso, index) => (
            <TableRow key={index}>
              <TableCell>
                <Link
                  type="button"
                  href={compromisso.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center py-2"
                >
                  <File className="h-4 w-4 text-blue-600 mr-2" /> Baixar arquivo
                </Link>
              </TableCell>
              <TableCell>{compromisso.description}</TableCell>
              <TableCell>{compromisso.business}</TableCell>
              <TableCell>{compromisso.price}</TableCell>
              <TableCell>
                {(() => {
                  const oldDate = compromisso.expiredDate;
                  const replaceDate =
                    typeof oldDate === "string"
                      ? oldDate.replace(/-/g, "/")
                      : oldDate;
                  return <>{replaceDate}</>;
                })()}
              </TableCell>
              <TableCell>
                {compromisso.status  ? "Pago" : "Pendente"}
              </TableCell>
              <TableCell>{compromisso.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
