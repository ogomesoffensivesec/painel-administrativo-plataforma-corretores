"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useEffect, useState } from "react";
import { listaDeDocumentos } from "./novo.imovel.dialog";
import useData from "@/hooks/useData";
import { useQueryClient } from "react-query";
import { toast } from "@/components/ui/use-toast";
import { File, Folder, Info, Trash } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

function DocumentosImovel({ imovel, documentos }) {
  const queryClient = useQueryClient();
  const { cadastrarNovosDocumentos, loading, deletarDocumento } = useData();
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [tipoNovoDocumento, setTipoNovoDocumento] = useState("");
  const [novoDocumento, setNovoDocumento] = useState({});
  const [documentosFiltrados, setDocumentosFiltrados] = useState([]);
  const [adicionarNovoDocumento, setAdicionarNovoDocumento] = useState(false);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [documentosSelecionados, setDocumentosSelecionados] = useState([]);

  useEffect(() => {
    if (documentos) {
      const tiposUnicos = [...new Set(documentos.map((doc) => doc.tipo))];
      const documentosAgrupados = documentos.reduce((type, doc) => {
        if (!type[doc.tipo]) {
          type[doc.tipo] = [];
        }
        type[doc.tipo].push(doc);
        return type;
      }, {});
      setTiposDocumentos(tiposUnicos);
      setDocumentosSelecionados(documentosAgrupados);
    }
  }, [documentos]);

  useEffect(() => {
    if (tipoDocumento && documentos) {
      const documentosDoTipo = documentosSelecionados[tipoDocumento];
      setDocumentosFiltrados(documentosDoTipo);
    } else {
      if (documentos) {
        const documentosAgrupados = documentos.reduce((type, doc) => {
          if (!type[doc.tipo]) {
            type[doc.tipo] = [];
          }
          type[doc.tipo].push(doc);
          return type;
        }, {});
        setDocumentosFiltrados(documentosAgrupados);
      }
    }
  }, [tipoDocumento]);

  const handleNovoDocumento = (event) => {
    const files = event.target.files;
    const filesArray = Array.from(files);
    setNovoDocumento((prevState) => ({
      ...prevState,
      [tipoNovoDocumento]: filesArray,
    }));
  };

  const enviarNovoDocumento = async () => {
    if (tipoNovoDocumento === "" || Object.values(novoDocumento).length === 0) {
      toast({
        title: "Informe o tipo do documento ou selecione um documento",
        variant: "destructive",
      });
      return;
    }

    setDocumentosFiltrados([]);
    const docsAgrp = await cadastrarNovosDocumentos(imovel, novoDocumento);
    const arrayDocs = docsAgrp;
    console.log(`Documentos adicionados`);
    console.log(arrayDocs);
    setDocumentosFiltrados(arrayDocs);

    const arrayTipos = tiposDocumentos;
    if (!arrayTipos.includes(tipoNovoDocumento)) {
      setTiposDocumentos([...tiposDocumentos, tipoNovoDocumento]);
    }

    // Reinicializa os estados relacionados ao novo documento
    setAdicionarNovoDocumento(false);
    setTipoDocumento(tipoNovoDocumento);
    setNovoDocumento({});
    setTipoNovoDocumento("");
  };

  const handleRemoverDocumento = async (docId) => {
    await deletarDocumento(imovel.id, docId, documentos);
    const atualizarDocumentos = documentosFiltrados.filter(
      (docs) => docs.id !== docId
    );
    setDocumentosFiltrados(atualizarDocumentos);

    if (documentosFiltrados && documentosFiltrados.length === 1) {
      const atualizarTipos = tiposDocumentos.filter(
        (tp) => tp !== tipoDocumento
      );
      setTiposDocumentos(atualizarTipos);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="h-9  px-3 border-none outline-none  bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-1 justify-center items-center text-sm">
        Documentação
      </DialogTrigger>
      <DialogContent className="w-7/12">
        <DialogHeader>
          <DialogTitle>Documentos do imóvel {imovel.nome}</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-6">
          {/* {!adicionarNovoDocumento && (
            <Select onValueChange={(e) => setTipoDocumento(e)} className="h-80">
              <SelectTrigger className="w-full">
                <span className="placeholder">
                  Filtrar por tipo de documento
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"todos"}>Mostrar todos</SelectItem>
                {tiposDocumentos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} */}
          <div>
            <div className="w-full flex justify-between items-center mb-2">
              <span className="font-bold text-lg ">
                {adicionarNovoDocumento
                  ? "Enviar novos documentos"
                  : "Documentos encontrados"}
              </span>
              <Button
                size="sm"
                type="button"
                onClick={() =>
                  setAdicionarNovoDocumento(!adicionarNovoDocumento)
                }
              >
                {adicionarNovoDocumento
                  ? "Visualizar documentos"
                  : "Adicionar documentos"}
              </Button>
            </div>
            <div className="w-full flex mt-6  flex-col space-y-4">
              <div className="w-full flex  ">
                <div className="w-[400px] h-[450px]  flex flex-col border-r-[1px] border-r-stone-200 bg-stone-50  border-md shadow-xs ">
                  {adicionarNovoDocumento && (
                    <div className="mb-2 flex flex-col gap-1 items-center">
                      <Select onValueChange={(e) => setTipoNovoDocumento(e)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tipos predefinidos" />
                        </SelectTrigger>
                        <SelectContent className="h-[400px]">
                          {listaDeDocumentos.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Criar pasta de tipo de arquivo"
                        id="tipo"
                        type="text"
                        value={tipoNovoDocumento}
                        onChange={(e) => setTipoNovoDocumento(e.target.value)}
                      />
                      <Input
                        type="file"
                        onChange={handleNovoDocumento}
                        multiple
                        accept={
                          ".pdf, .doc,.docx,.xls,.xlsm,.xlsx,.png,.jpeg,.jpg"
                        }
                        id="documento"
                      />
                      <Button
                        className="mt-2 w-full"
                        type="button"
                        size="sm"
                        onClick={enviarNovoDocumento}
                        disabled={loading}
                      >
                        Enviar documentos
                      </Button>
                    </div>
                  )}
                  <ScrollArea>
                    <ul className="space-y-1  ">
                      {tiposDocumentos.map((docKey, index) => (
                        <li
                          key={index}
                          onClick={() => setTipoDocumento(docKey)}
                          className={`
                            flex py-2 px-2 gap-1.5 items-center text-sm font-semibold ${
                              docKey === tipoDocumento
                                ? "text-blue-600"
                                : "text-stone-700"
                            } cursor-pointer transition-all duration-400 hover:bg-blue-200 `}
                        >
                          <Folder
                            size={16}
                            fill={docKey === tipoDocumento ? "#2563eb" : "none"}
                            className={`
                           ${
                             docKey === tipoDocumento
                               ? "text-blue-600"
                               : "text-stone-700"
                           }`}
                          />
                          {docKey}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
                <div className="w-full ">
                  <ul className="space-y-1 ">
                    {documentosFiltrados &&
                      documentosFiltrados.length > 0 &&
                      documentosFiltrados.map((doc, index) => (
                        <div className="w-full flex justify-between items-center ">
                          <Link
                            href={doc.url}
                            onClick={() => {
                              toast({
                                title: "Documento baixado com sucesso",
                                variant: "success",
                              });
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            className="flex py-2 px-2 gap-1.5 items-center text-sm text-stone-700 cursor-pointer transition-all duration-400 hover:bg-stone-200 "
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className=" flex text-left gap-2 items-center w-[350px] overflow-hidden overflow-ellipsis whitespace-nowrap">
                                  <File size={16} />

                                  <span className=" w-[350px] overflow-hidden overflow-ellipsis whitespace-nowrap ">
                                    {doc.name}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p> {doc.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Link>
                          <div className="flex gap-2 items-center p-2">
                            {doc.createdAt && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="xs"
                                    className="gap-2 hover:text-blue-800 hover:bg-blue-50"
                                  >
                                    <Info size="16" />
                                    Informações
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <div className="w-full flex gap-1 text-xs">
                                    <span className="font-semibold text-stone-700">
                                      Criado em:
                                    </span>
                                    <span>{doc.createdAt}</span>
                                  </div>
                                  {doc.createdBy && (
                                    <div className="w-full flex gap-1 text-xs">
                                      <span className="font-semibold text-stone-700">
                                        Criado por:
                                      </span>
                                      <span>{doc.createdBy}</span>
                                    </div>
                                  )}
                                  <div className="w-full flex gap-1 text-xs">
                                    <span className="font-semibold text-stone-700">
                                      Na pasta:
                                    </span>
                                    <span>{doc.tipo}</span>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                            <Trash
                              onClick={() => handleRemoverDocumento(doc.id)}
                              size={20}
                              className="text-red-500 shadow-sm  hover:fill-red-500 fill-white cursor-pointer  transition-all duration-500 "
                            />
                          </div>
                        </div>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentosImovel;
