"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCheckIcon, Ticket, X } from "lucide-react";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "@/database/config/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
import { UpsertActionDemmand } from "./_components/upsert-action-on-demman";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");
export default function Page({ params }) {
  const [demmand, setDemmand] = useState();
  const [actions, setActions] = useState([]);
  useEffect(() => {
    const referenciaDataBase = ref(database, `/chamados/${params.demmandId}`);
    onValue(referenciaDataBase, (snapshot) => {
      if (snapshot.exists()) {
        setDemmand(snapshot.val());
        const actionsArray = snapshot.val().actions;
        setActions(Object.values(actionsArray));
      }
    });
  }, [params.demmandId]);


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
              <UpsertActionDemmand demmand={demmand} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="h-[330px]">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Detalhes do Chamado</CardTitle>
            </CardHeader>
            <CardContent>
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
              <CardDescription>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-md font-medium">Descrição</span>
                </div>
                <p className="text-gray-500 mb-2 text-sm">
                  Usuários estavam tendo dificuldades para acessar o sistema devido
                  a um problema no módulo de autenticação.
                </p>
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="h-auto col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Histórico de Atualizações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <ScrollArea className="h-[500px] pr-4 ">
                  {actions.length > 0 &&
                    actions.map((action, index) => (
                      <div
                        key={index}
                        className="flex flex-col  gap-4 mb-2"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {action.currentUser}
                              </span>
                              <CheckCheckIcon className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span> {dayjs().to(dayjs(action.createdAt))}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {action.description}
                          </p>
                          <Button
                            size="xs"
                            className="mt-3"
                            onClick={() => {
                              Object.values(action.prints).forEach((print) => {
                                window.open(print.url, "_blank");
                              });
                            }}
                          >
                            Ver prints
                          </Button>
                        </div>
                        {index < actions.length - 1 && <Separator />}
                      </div>
                    ))}
                </ScrollArea>
                {!demmand.actions && (
                  <div>Este chamado ainda não teve atualizações.</div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {/* Add footer content here */}
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  );
}
