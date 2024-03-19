import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Documents from "./empreendimento.documentos";
import EmpreendimentoNegotiations from "./empreendimento.negotiations";
import Modelos from "./empreendimento.modelos";

function TabsOptions({ empreendimento }) {
  const { modelos } = empreendimento;

  console.log(empreendimento);
  return (
    <Tabs defaultValue="models" className="w-full">
      <TabsList>
        <TabsTrigger value="models">Modelos do imóvel</TabsTrigger>
        <TabsTrigger value="documents">Documentos</TabsTrigger>
        {/* <TabsTrigger value="negotiations">Negociações</TabsTrigger> */}
      </TabsList>
      <TabsContent value="models">
        <Modelos modelos={modelos} />
      </TabsContent>
      <TabsContent value="documents">
        <Documents modelos={modelos} />
      </TabsContent>
      {/* <TabsContent value="negotiations">
        <EmpreendimentoNegotiations />
      </TabsContent> */}
    </Tabs>
  );
}

export default TabsOptions;
