"use client";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "@/database/config/firebase";
import { listaDeDocumentos } from "@/components/dashboard/empresas/nova.empresa";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContasPagar from "./_components/contas-a-pagar-view";
import { Badge } from "@/components/ui/badge";

export default function EmpresaDetails({ params }) {
  const [empresa, setEmpresa] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const referenciaDataBase = ref(database, `/empresas/${params.empresaId}`);
    onValue(referenciaDataBase, (snapshot) => {
      if (snapshot.exists()) {
        setEmpresa(snapshot.val());
      }
    });
  }, [params.empresaId]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  if (!empresa) return null;

  return (
    empresa && (
      <div className="flex flex-col gap-8 p-8 md:p-10 lg:p-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/empresas">
                Empresas
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {empresa.razaoSocial && empresa.razaoSocial}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Detalhes da Empresa</h1>
          {empresa.invoices && Object.values(empresa.invoices).length > 0 && (
            <Badge variant="warning" className='h-8 px-6'>
              <span className="text-[15px]">
                Você tem {Object.values(empresa.invoices).length} contas à
                pagar!
              </span>
            </Badge>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Razão Social</h2>
            <p>{empresa.razaoSocial}</p>
          </div>
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Endereço</h2>
            <p>
              {empresa.rua}, {empresa.numero} <br />
              {empresa.bairro} / {empresa.cidade}
            </p>
          </div>
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Sócios</h2>
            <div className="grid gap-2">
              {empresa.socios &&
                empresa.socios.map((socio, index) => (
                  <div className="flex items-center gap-2" key={socio.id}>
                    <div className="flex gap-2">
                      <p>{index + 1}</p> -
                      <p className="font-medium">
                        {socio.razaoSocial || socio.nome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {socio.tipoSocio}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="gap-4 w-full">
          <Tabs defaultValue="documentos" className="w-full">
            <TabsList>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="contas-pagar">Contas à pagar</TabsTrigger>
            </TabsList>
            <TabsContent value="documentos" className="w-full">
              <div className="mb-6 space-y-3">
                <Label>Pesquise os documentos que deseja:</Label>
                <Input
                  placeholder="Procurar documentos..."
                  className="max-w-lg"
                  onChange={handleSearch}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {empresa.documentos &&
                  empresa.documentos
                    .filter((doc) =>
                      doc.tipo.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((doc) => (
                      <Card className="max-w-sm h-auto" key={doc.id}>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Folder className="h-6 w-6 text-primary" />
                            <CardTitle>{doc.tipo}</CardTitle>
                          </div>
                          <CardDescription className="text-xs text-muted-foreground">
                            {doc.tipo.toLowerCase() === "cnpj" &&
                              "Cartão CNPJ com todas as informações desta empresa."}
                            {doc.tipo.toLowerCase() ===
                              listaDeDocumentos[0].nome.toLowerCase() &&
                              listaDeDocumentos[0].descricao}
                            {doc.tipo.toLowerCase() ===
                              listaDeDocumentos[1].nome.toLowerCase() &&
                              listaDeDocumentos[1].descricao}
                            {doc.tipo.toLowerCase() ===
                              listaDeDocumentos[2].nome.toLowerCase() &&
                              listaDeDocumentos[2].descricao}
                            {doc.tipo.toLowerCase() ===
                              listaDeDocumentos[3].nome.toLowerCase() &&
                              listaDeDocumentos[3].descricao}
                            {doc.tipo.toLowerCase() ===
                              listaDeDocumentos[4].nome.toLowerCase() &&
                              listaDeDocumentos[4].descricao}
                            {doc.tipo.toLowerCase() ===
                              listaDeDocumentos[5].nome.toLowerCase() &&
                              listaDeDocumentos[5].descricao}
                            {doc.tipo.toLowerCase() ===
                              listaDeDocumentos[6].nome.toLowerCase() &&
                              listaDeDocumentos[6].descricao}
                          </CardDescription>
                          <div className="py-3">
                            <div className="text-sm text-muted-foreground">
                              Criado em: {doc.createdAt}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Criado por: {doc.createdBy}
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="flex h-[50px] justify-end">
                          <Link
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              Visualizar
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
              </div>
            </TabsContent>
            <TabsContent value="contas-pagar">
              <ContasPagar contas={empresa?.contasPagar} id={empresa.id} />
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-start"></div>
        </div>
      </div>
    )
  );
}
