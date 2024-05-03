"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function EmpresaInfos({ empresa }) {
  const { rua, numero, bairro, cidade, cep } = empresa;
  const endereco = `${rua} - ${numero}`;
  const outrasInfosEndereco = `${bairro} - ${cidade}`;
  return (
    <Dialog>
      <DialogTrigger className="h-9  px-3 border-none outline-none  bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-1 justify-center items-center text-sm">
        Informações
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informações da empresa</DialogTitle>
          <Card>
            <CardContent className="py-4">
              <ul className="space-y-3">
                <li>
                  <strong>Identificação:</strong> {empresa.razaoSocial}
                </li>
                <li className="w-full flex flex-col">
                  <span>
                    <strong>Endereço:</strong> {endereco}
                  </span>
                  <span>
                    {outrasInfosEndereco} -{" "}
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${cep}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>{cep}</TooltipTrigger>
                          <TooltipContent>
                            <p>Clique para visualizar no mapa.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Link>
                  </span>
                </li>
                <li className=" w-full flex flex-col">
                  <span className="font-bold text-stone-800">Sócios:</span>
                  {empresa.socios &&
                    empresa.socios.map((socio) => (
                      <span>{socio.nome || socio.razaoSocial}</span>
                    ))}
                </li>
              </ul>
            </CardContent>
          </Card>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EmpresaInfos;
