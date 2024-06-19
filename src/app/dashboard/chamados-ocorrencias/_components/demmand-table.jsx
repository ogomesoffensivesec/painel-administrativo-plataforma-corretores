"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { auth, database } from "@/database/config/firebase";
import { onValue, ref } from "firebase/database";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export function DemmandTable() {
  const router = useRouter();
  const [demmands, setDemmands] = useState([]);
  const user = auth.currentUser;
  useEffect(() => {
    const referenciaDataBase = ref(database, "/chamados");
    const unsubscribe = onValue(referenciaDataBase, (snapshot) => {
      if (snapshot.exists()) {
        const demmandsArray = Object.values(snapshot.val()).filter(
          (demmand) =>
            demmand.currentUser === user?.displayName ||
            demmand.currentUser === user?.email
        );
        setDemmands(demmandsArray);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const sectors = [
    { value: "ti", label: "T.I - Igor Gomes" },
    { value: "rh", label: "Recursos Humanos - João Silva" },
    { value: "finance", label: "Financeiro - Maria Santos" },
    { value: "marketing", label: "Marketing - Ana Oliveira" },
  ];
  const internalProblems = [
    { value: "internetDown", label: "Sem acesso à internet" },
    { value: "printerNotWorking", label: "Impressora não imprime" },
    { value: "computerSlow", label: "Computador está lento" },
    { value: "softwareNotWorking", label: "Software não está funcionando" },
    { value: "cantConnect", label: "Não consigo conectar à rede" },
    { value: "emailNotSending", label: "E-mail não está sendo enviado" },
    { value: "hardwareBroken", label: "Hardware quebrado" },
    { value: "other", label: "Outro problema (explique na descrição)" },
  ];
  return (
    demmands.length > 0 && (
      <Table>
        <TableCaption>Lista de seus chamados recentes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Setor</TableHead>
            <TableHead>Tipo de problema</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Descrição do problema</TableHead>
            <TableHead>Acompanhar chamado</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demmands.map((demmand) => (
            <TableRow key={demmand.id}>
              <TableCell>
                {
                  sectors.find((sector) => sector.value === demmand.setor)
                    ?.label
                }
              </TableCell>
              <TableCell>
                {
                  internalProblems.find(
                    (problem) => problem.value === demmand.issueType
                  )?.label
                }
              </TableCell>
              <TableCell>{dayjs().to(dayjs(demmand.createdAt))}</TableCell>
              <TableCell>{demmand.problemDescription}</TableCell>
              <TableCell>{demmand.followUp ? "Sim" : "Não"}</TableCell>
              <TableCell>{demmand.currentUser}</TableCell>
              <TableCell>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/dashboard/chamados-ocorrencias/${demmand.id}`
                    )
                  }
                >
                  Acompanhar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
}
