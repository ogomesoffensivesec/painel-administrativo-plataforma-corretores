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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listaDeDocumentos } from "./novo.imovel.dialog";
import { v4 } from "uuid";
import useData from "@/hooks/useData";
import { useQueryClient } from "react-query";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

function DocumentosImovel({ imovel, documentos }) {
  const queryClient = useQueryClient();
  const { cadastrarNovosDocumentos, loading } = useData();
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [tipoNovoDocumento, setTipoNovoDocumento] = useState("");
  const [novoDocumento, setNovoDocumento] = useState({});
  const [documentosFiltrados, setDocumentosFiltrados] = useState([]);
  const [adicionarNovoDocumento, setAdicionarNovoDocumento] = useState(false);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);

  useEffect(() => {
    const tiposUnicos = [...new Set(documentos.map((doc) => doc.tipo))];
    setTiposDocumentos(tiposUnicos);
    setDocumentosFiltrados(documentos);
  }, [documentos]);

  useEffect(() => {
    if (tipoDocumento) {
      if (tipoDocumento === "todos") {
        setTipoDocumento("");
      }
      const documentosFilter = documentos.filter(
        (doc) => doc.tipo === tipoDocumento
      );
      setDocumentosFiltrados(documentosFilter);
    } else {
      // Se nenhum tipo selecionado, exibir todos os documentos
      setDocumentosFiltrados(documentos);
    }
  }, [tipoDocumento, documentos]);

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
    await cadastrarNovosDocumentos(imovel, novoDocumento);
    setNovoDocumento();
    setTipoNovoDocumento();
    queryClient.invalidateQueries({ queryKey: ["imoveis"] });
  };
  return (
    <Dialog>
      <DialogTrigger className="h-9  px-3 border-none outline-none  bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-1 justify-center items-center text-sm">
        Documentação
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Documentos do imóvel {imovel.nome}</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-6">
          {!adicionarNovoDocumento && (
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
          )}
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
            {!adicionarNovoDocumento && (
              <div>
                <ul className="space-y-2 ">
                  {documentosFiltrados.map((documento) => (
                    <li key={documento.id} className="flex items-center gap-2">
                      <Link
                        className={badgeVariants({ variant: "default" })}
                        href={documento.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {documento.tipo} - Clique para baixar ou visualizar
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {adicionarNovoDocumento && (
              <div className="w-full flex  flex-col  gap-2">
                <Select onValueChange={(e) => setTipoNovoDocumento(e)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um item" />
                  </SelectTrigger>
                  <SelectContent className="h-[200px]">
                    {listaDeDocumentos.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label htmlFor="tipo">Tipo de documento</Label>
                <div className="w-full flex gap-2 ">
                  <Input
                    id="tipo"
                    type="text"
                    value={tipoNovoDocumento}
                    onChange={(e) => setTipoNovoDocumento(e.target.value)}
                  />
                  <Input
                    type="file"
                    onChange={handleNovoDocumento}
                    multiple
                    accept={".pdf, .doc,.docx,.xls,.xlsm,.xlsx,.png,.jpeg,.jpg"}
                    id="documento"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    onClick={enviarNovoDocumento}
                    disabled={loading}
                  >
                    Enviar documentos
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentosImovel;
