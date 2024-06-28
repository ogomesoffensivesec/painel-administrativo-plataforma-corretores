"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uid } from "uid";
import { ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { auth, database, storage } from "@/database/config/firebase";
import { v4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const empresas = [
  { id: 0, razaoSocial: "Nenhum" },
  { id: 1, razaoSocial: "MAKE LOCAÇÕES" },
  { id: 2, razaoSocial: "RESIDENCIAL TREVISO" },
  { id: 3, razaoSocial: "BM IMPORTS" },
  { id: 4, razaoSocial: "INDCON HOLDINGS" },
  { id: 5, razaoSocial: "NOBRE TRADING" },
  { id: 6, razaoSocial: "GABRIELA AP.GROSSI" },
  { id: 7, razaoSocial: "MAKE HOME" },
  { id: 8, razaoSocial: "MEGA TRADING" },
  { id: 9, razaoSocial: "CONSTRUBANK" },
  { id: 10, razaoSocial: "ALEXANDRE MELO DE ARAUJO PEREIRA" },
  { id: 11, razaoSocial: "MAICON ROBERTO FERRAZ" },
  { id: 12, razaoSocial: "MHGV" },
  { id: 13, razaoSocial: "DON LUCK" },
  { id: 14, razaoSocial: "JJ COMERCIO" },
  { id: 15, razaoSocial: "DR. FERRAZ" },
  { id: 16, razaoSocial: "DONATEKA" },
  { id: 17, razaoSocial: "FERRAZ HOLDING" },
  { id: 18, razaoSocial: "LUCIANA FRANCO DE SILVEIRA" },
  { id: 19, razaoSocial: "MDK" },
  { id: 20, razaoSocial: "ADILSON DA SILVA RESENDE" },
  { id: 21, razaoSocial: "ALINE CRISTINA DA SILVA MALOSTE" },
];

export function InserirCompromisso({ children }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = useRef();

  const { handleSubmit, register, reset, setValue } = useForm();

  const onSubmit = async (data) => {
    data.id = v4();
    setLoading(true);
    let dataFile = data.file[0];
    let newFileName = uid(32);
    let renamedFile = new File([dataFile], newFileName, {
      type: dataFile.type,
    });
    data.file = renamedFile;

    const dateObj = new Date(data.expiredDate);
    const dia = String(dateObj.getDate()).padStart(2, "0");
    const mes = String(dateObj.getMonth() + 1).padStart(2, "0");
    const ano = dateObj.getFullYear();
    data.expiredDate = `${dia}/${mes}/${ano}`;
    const formattedDate = new Date(data.expiredDate);
    data.expiredDate = formattedDate;
    data.user = auth.currentUser?.email;
    const contentType = data.file.type;
    try {
      const referenciaCompromisso = databaseRef(
        database,
        `/compromissos/${data.id}`
      );
      const referenciaStorage = storageRef(
        storage,
        `/compromissos/${data.file.name}`
      );

      const uploadTask = uploadBytesResumable(
        referenciaStorage,
        data.file,
        contentType
      );
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressValue);
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            data.file = downloadURL;
            set(referenciaCompromisso, data);
            toast({
              title: "Compromisso adicionado com sucesso",
              description:
                "Este compromisso foi adicionado na lista de compromissos",
              variant: "success",
            });
            setLoading(false);
            reset();
          });
        }
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Houve um erro ao inserir",
        description: "Consulte sua conexão com internet ou tente novamente!",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" ref={ref}>
          {children}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Novo compromisso</SheetTitle>
          <SheetDescription>Preencha os campos.</SheetDescription>
        </SheetHeader>
        <div className="h-full mt-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-grow space-y-4"
          >
            <div>
              <Select onValueChange={(e) => setValue("business", e)} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem value={empresa.razaoSocial} key={empresa.id}>
                      {empresa.razaoSocial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descrição</Label>
              <Input
                required
                type="text"
                {...register("description")}
                placeholder="Descreva o compromisso financeiro"
              />
            </div>
            <div>
              <Label>Valor</Label>
              <Input
                required
                type="text"
                {...register("price")}
                placeholder="R$ Valor"
              />
            </div>
            <div>
              <Label>Arquivo</Label>
              <Input
                required
                type="file"
                {...register("file")}
                accept=".pdf,.xlsx,.xlsm"
                placeholder="Arquivo"
              />
            </div>
            <div>
              <Label>Vencimento</Label>
              <Input
                required
                type="date"
                lang="pt-BR"
                {...register("expiredDate")}
              />
            </div>
            <div className="flex justify-between">
              <Label>Status - Pago?</Label>
              <Checkbox {...register("status")} />
            </div>
            <div className="pt-4 flex justify-end">
              {!loading ? (
                <Button type="submit">Inserir compromisso</Button>
              ) : (
                <Progress value={progress} />
              )}
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
