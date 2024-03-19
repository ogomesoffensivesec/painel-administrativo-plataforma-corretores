"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

const generateFakeArray = (length) => {
  const fakeArray = [];
  for (let i = 0; i < length; i++) {
    fakeArray.push({
      id: i + 1,
      name: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
    });
  }
  return fakeArray;
};

function Documents({ modelos }) {
  const fakeArray = generateFakeArray(8);
  const [loading, setLoading] = useState(false);

  const downloadAllFilesFromFolder = async (counter) => {
    const modelo = modelos[counter];
    try {
      setLoading(true);

      const link = document.createElement("a");
      link.href = modelo.arquivoDocumentos.url;
      link.download = "documentos.zip";
      link.click();
      toast({
        title: "Documentos baixados!",
        description: "Você acaba de baixar os documentos do imóvel!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar documentos!",
        description: "Tente novamente em alguns instantes!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Accordion type="single" collapsible>
      {modelos.map((modelo, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>
            <span>
              Documentos do modelo {index + 1} -{" "}
              {"R$ " +
                modelo.price.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="w-full flex justify-between items-center mb-8">
              <span>Resumo de todos os documentos do empreendimento</span>
              {modelo.documentos && (
                <Button
                  type="button"
                  size="sm"
                  className="w-[220px] gap-2 "
                  onClick={() => downloadAllFilesFromFolder(index)}
                >
                  <Download size={16} /> Baixar todos documentos
                </Button>
              )}
            </div>
            <ScrollArea className=" lg:h-[450px] md:h-[250px] w-full">
              <ul className="space-y-3">
                {modelo.documentos &&
                  modelo.documentos.map((documento, index) => {
                    return (
                      <li
                        key={documento.id}
                        className="w-full flex justify-between items-center"
                      >
                        <span className="capitalize">{documento.name}</span>
                        <Button size="sm" type="button">
                          <Link
                            href={documento.url}
                            target="__blank"
                            rel="noopener noreferrer"
                          >
                            Baixar documento
                          </Link>
                        </Button>
                      </li>
                    );
                  })}
                {!modelo.documentos && <span>Nenhum documento encontrado</span>}
              </ul>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default Documents;
