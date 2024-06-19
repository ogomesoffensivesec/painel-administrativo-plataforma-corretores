"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, CheckCheckIcon, Info, Ticket, X } from "lucide-react";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "@/database/config/firebase";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");
export default function Page({ params }) {
  const [demmand, setDemmand] = useState();

  useEffect(() => {
    const referenciaDataBase = ref(database, `/chamados/${params.demmandId}`);
    onValue(referenciaDataBase, (snapshot) => {
      if (snapshot.exists()) {
        setDemmand(snapshot.val());
      }
    });
  }, [params.demmandId]);

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
    demmand && (
      <div className="container mx-auto py-8">
        <Breadcrumb className="py-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/chamados-ocorrencias">
                Chamados e Ocorrências
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/dashboard/chamados-ocorrencias/${demmand.id}`}
              >
                {internalProblems.find(
                  (problem) => problem.value === demmand.issueType
                )?.label ?? demmand.issueType}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detalhes do chamado</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex  items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Ticket className="w-6 h-6 text-gray-500" />
            <h1 className="text-2xl font-bold">
              Chamado{" "}
              {internalProblems.find(
                (problem) => problem.value === demmand.issueType
              )?.label ?? demmand.issueType}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="success"
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                demmand.solved ? "border-green" : "border-destructive"
              }`}
            >
              {demmand.solved ? (
                <>
                  <CheckCheckIcon className="w-4 h-4 mr-1" />
                  Resolvido
                </>
              ) : (
                <div className="text-destructive flex">
                  <X className="w-4 h-4 mr-1 " /> Pendente
                </div>
              )}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span></span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md h-[300px] p-4 text-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">Detalhes do Chamado</h2>
            </div>
            <div className="grid grid-cols-1 gap-2 mb-4">
              <div className="w-full flex items-center gap-2">
                <span className="text-gray-500">Status:</span>
                <Badge
                  className="font-medium"
                  variant={demmand.solved ? "success" : "warning"}
                >
                  {demmand.solved ? "Resolvido" : "Em aberto"}
                </Badge>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-gray-500">Data de Abertura:</span>
                <span className="font-normal">
                  {dayjs().to(dayjs(demmand.createdAt))}
                </span>
              </div>
              <div className="w-full flex items-center gap-2">
                <span className="text-gray-500">Prioridade:</span>
                {dayjs().diff(dayjs(demmand.createdAt), "day") < 2 ? (
                  <Badge
                    variant="outline"
                    className="font-medium text-blue-500"
                  >
                    Baixa
                  </Badge>
                ) : dayjs().diff(dayjs(demmand.createdAt), "day") < 4 ? (
                  <Badge
                    variant="warning"
                    className="font-medium text-yellow-500"
                  >
                    Média
                  </Badge>
                ) : (
                  <Badge
                    variant="destructive"
                    className="font-medium text-red-500"
                  >
                    Alta
                  </Badge>
                )}
              </div>
              <div className="w-full flex items-center gap-2 ">
                <span className="text-gray-500">Categoria:</span>
                <span className="font-medium">
                  {internalProblems.find(
                    (problem) => problem.value === demmand.issueType
                  )?.label ?? demmand.issueType}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-md font-medium">Descrição</span>
            </div>
            <p className="text-gray-500 mb-2 text-sm">
              Usuários estavam tendo dificuldades para acessar o sistema devido
              a um problema no módulo de autenticação.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md  h-[570px] p-4 col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Histórico de Atualizações</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ScrollArea className="h-[500px] ">
                {demmand.actions && demmand.actons.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">João da Silva</span>
                          <CheckCheckIcon className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span> {dayjs().to(dayjs(demmand.createdAt))}</span>
                        </div>
                      </div>
                      <p className="text-gray-500">
                        Identificado e corrigido o problema no módulo de
                        autenticação. Usuários já podem acessar o sistema
                        normalmente.
                      </p>
                    </div>
                  </div>
                )}

                {!demmand.actions && (
                  <div>Este chamado ainda não teve atualizações.</div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    )
  );
}