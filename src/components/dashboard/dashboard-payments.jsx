import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { File } from "lucide-react";
import React from "react";


function TableComponent() {
  const documents = [
    {
      icon: <File size={28} className="text-blue-500" />,
      name: "jan-2024.pdf",
      createdAt: "02/02/2024",
      downloadButton: <Button variant="outline" className="bg-stone-900 text-white dark:text-stone-950 dark:bg-white">Baixar arquivo</Button>,
    },
  ];

  return (
    <Table>
      <TableCaption>Lista de comprovantes de pagamento.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] dark:text-stone-300">
            Arquivo
          </TableHead>
          <TableHead className="dark:text-stone-300">Nome</TableHead>
          <TableHead className="dark:text-stone-300">Criado em</TableHead>
          <TableHead className="text-right dark:text-stone-300">
            Download
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document) => (
          <TableRow key={document.name}>
            <TableCell className=" dark:text-white">{document.icon}</TableCell>
            <TableCell className=" dark:text-white">{document.name}</TableCell>
            <TableCell className=" dark:text-white">{document.createdAt}</TableCell>
            <TableCell className=" text-right">
              {document.downloadButton}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/*
        <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    */}
    </Table>
  );
}

export default TableComponent;
