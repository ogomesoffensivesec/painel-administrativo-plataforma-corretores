"use client";
import { useEffect, useState } from "react";
import { database } from "@/database/config/firebase";
import { onValue, ref } from "firebase/database";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CertificatesTable() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const referenciaDatabase = ref(database, "/certificados");
    const unsubscribe = onValue(referenciaDatabase, (snapshot) => {
      if (snapshot.exists()) {
        setCertificates(Object.values(snapshot.val()));
        console.log(Object.values(snapshot.val()));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <ScrollArea className="h-[550px] w-full ">
        <Table className="w-full">
          <TableCaption>Lista de seus certificados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Arquivo</TableCell>
              <TableCell>Data de criação</TableCell>
              <TableCell>Data de expiração</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Dias restantes</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((certificate) => {
              const expirationDate = new Date(certificate.expirationAt);
              const currentDate = new Date();
              const isExpired = expirationDate < currentDate;
              const createdDate = new Date(certificate.createdAt);
              const month = createdDate.getMonth() + 1;
              const formateedCreatedDate = `${createdDate.getDate()}/${
                month < 10 ? `0${month}` : month
              }/${createdDate.getFullYear()}`;
              const expirationMonth = expirationDate.getMonth() + 1;
              const formattedExpirationDate = `${expirationDate.getDate()}/${
                expirationMonth < 10 ? `0${expirationMonth}` : expirationMonth
              }/${expirationDate.getFullYear()}`;
              const daysRemaining = Math.floor(
                (expirationDate - currentDate) / (1000 * 3600 * 24)
              );
              return (
                <TableRow key={certificate.id} className='w-full'>
                  <TableCell className="w-[250px]">
                    {certificate.name}
                  </TableCell>
                  <TableCell
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {certificate.file.map((file) => (
                      <a
                        key={file.id}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file.name}
                      </a>
                    ))}
                  </TableCell>
                  <TableCell>{formateedCreatedDate}</TableCell>
                  <TableCell>{formattedExpirationDate}</TableCell>
                  <TableCell>
                    {isExpired ? (
                      <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                        Expirado
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                        Válido
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`bg-${
                        daysRemaining <= 30 ? "yellow" : "green"
                      }-100 text-${
                        daysRemaining <= 30 ? "yellow" : "green"
                      }-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded`}
                    >
                      {daysRemaining} dias
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
