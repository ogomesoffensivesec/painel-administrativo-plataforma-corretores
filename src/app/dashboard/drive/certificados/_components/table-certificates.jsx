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
import { ConfirmDownloadCertificate } from "./confirm-download-certificate";

export function CertificatesTable() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://032a-191-249-60-231.ngrok-free.app//certificates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setCertificates(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  return (
    <div>
      <ScrollArea className="h-[550px] w-full ">
        <Table className="w-full">
          <TableCaption>Lista de seus certificados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableCell>Empresa</TableCell>
              <TableCell>Emitido em</TableCell>
              <TableCell>Valido até</TableCell>
              <TableCell>Valido por (dias)</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Carregando...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4}>Erro: {error}</TableCell>
              </TableRow>
            ) : (
              certificates.map((certificate, index) => (
                <TableRow key={index}>
                  <TableCell>{certificate.Empresa}</TableCell>
                  <TableCell>{certificate["Emitido em"]}</TableCell>
                  <TableCell>{certificate["Valido até"]}</TableCell>
                  <TableCell>{certificate["Valido por"] > 0 ? certificate["Valido por"] : 'Expirado' }</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
