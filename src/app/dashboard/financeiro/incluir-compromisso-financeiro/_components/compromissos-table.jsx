"use client";
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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
export function TabelaCompromissos() {
  const [compromissos, setCompromissos] = useState([]);
  useEffect(() => {
    const databaseRef = ref(database, "/compromissos");
    const handleDataChange = (snapshot) => {
      if (snapshot.exists()) {
        setCompromissos(Object.values(snapshot.val()));
      } else {
        setCompromissos([]);
      }
    };

    onValue(databaseRef, handleDataChange);

    return () => {
      off(databaseRef, "value", handleDataChange);
    };
  }, []);

  return (
    <Table>
      <TableCaption>Lista de compromissos do dia</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Arquivo</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Usuário</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {compromissos.map((compromisso, index) => (
          <TableRow key={index}>
            <TableCell>
              <Link type="button" href={compromisso.file} target="_blank" rel="noopener noreferrer" className="flex items-center py-2">
                <File className="h-4 w-4 text-blue-600 mr-2" /> Baixar arquivo
              </Link>
            </TableCell>
            <TableCell>{compromisso.description}</TableCell>
            <TableCell>{compromisso.price}</TableCell>
            <TableCell>{compromisso.expiredDate}</TableCell>
            <TableCell>{compromisso.status}</TableCell>
            <TableCell>{compromisso.user}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
