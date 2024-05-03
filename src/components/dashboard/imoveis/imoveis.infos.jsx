"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function InfosImoveis({ imovel }) {
  const { rua, numero, bairro, cidade, cep } = imovel;
  const endereco = `${rua} - ${numero}`;
  const outrasInfosEndereco = `${bairro} - ${cidade} - ${cep}`;
  return (
    <Dialog>
      <DialogTrigger className="h-9  px-3 border-none outline-none  bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-1 justify-center items-center text-sm">
        Informações
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informações do imóvel</DialogTitle>
          <Card>
            <CardContent className="py-4">
              <ul className="space-y-3">
                <li>
                  <strong>Identificação:</strong> {imovel.nome}
                </li>
                <li className="w-full flex flex-col">
                  <span>
                    <strong>Endereço:</strong> {endereco}
                  </span>
                  <span>{outrasInfosEndereco}</span>
                </li>
                <li>
                  <strong>Proprietário:</strong>{" "}
                  {imovel.proprietario.nome || imovel.proprietario.razaoSocial}
                </li>
              </ul>
            </CardContent>
          </Card>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default InfosImoveis;
