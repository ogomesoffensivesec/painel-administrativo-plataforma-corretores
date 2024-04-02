import { useState } from "react";
import { ref as storageRef, deleteObject } from "firebase/storage";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Expand, Plus } from "lucide-react";
import Link from "next/link";
import { database, storage } from "@/database/config/firebase";
import { ref, update } from "firebase/database"; // Importe a função 'update' para atualizar o estado no Realtime Database
import AdicionarDocumentos from "./empreendimento.adicionar.documentos";

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

function Documents({ modelos, empreendimentoID }) {
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
        description: "Você acabou de baixar os documentos do imóvel!",
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

  const deleteDocument = async (docID, counter) => {
    const modelo = modelos[counter];
    const id = modelo.id;
    try {
      // const documentoRef = storageRef(
      //   storage,
      //   `/empreendimentos/${empreendimentoID}/modelos/${id}/documentos/${docID}`
      // );

      // await deleteObject(documentoRef);

      // Remova o documento do array 'documentos' do modelo
      const updatedModelos = [...modelos];
      updatedModelos[counter].documentos = updatedModelos[
        counter
      ].documentos.filter((doc) => doc.id !== docID);

      const refDatabase = ref(
        database,
        `/empreendimentos/${empreendimentoID}/modelos/${counter}`
      );
      // Converta o array de modelos para um objeto
      const modelosObj = updatedModelos.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {});
      console.log(`Updating: `);
      console.log(modelosObj);
      await update(refDatabase, modelo);

      console.log("Documento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir o documento:", error);
    }
  };

  return (
    <Accordion type="single" collapsible>
      {modelos.map((modelo, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="py-2">
            <span className="flex items-center gap-2">
              Documentos do modelo {index + 1} - clique aqui para expandir
              <Expand size={14} className="text-blue-500 " />
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="w-full flex justify-between items-center mb-8">
              <div className="w-full flex justify-between items-center">
                <span>Resumo de todos os documentos do empreendimento</span>
                <AdicionarDocumentos
                  empreendimentoId={empreendimentoID}
                  modeloId={modelo.id}
                  modelo={modelo}
                  modeloIndex = {index}
                />
              </div>
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
                        <div className="flex gap-2">
                          <Button size="sm" type="button">
                            <Link
                              href={documento.url}
                              target="__blank"
                              rel="noopener noreferrer"
                            >
                              Baixar documento
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            variant="destructive"
                            className="px-5"
                            onClick={() => deleteDocument(documento.id, index)}
                          >
                            Apagar
                          </Button>
                        </div>
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
