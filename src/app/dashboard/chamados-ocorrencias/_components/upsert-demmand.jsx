"use client";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { auth, database, storage } from "@/database/config/firebase";
import { v4 } from "uuid";
import { ref, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
export function UpsertDemmand() {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const sectors = [
    { value: "ti", label: "T.I - Igor Gomes" },
    { value: "rh", label: "Recursos Humanos - João Silva" },
    { value: "finance", label: "Financeiro - Maria Santos" },
    { value: "marketing", label: "Marketing - Ana Oliveira" },
  ];
  const [checked, setChecked] = useState(false);
  const internalProblems = [
    { value: "internetDown", label: "Sem acesso à internet" },
    { value: "printerNotWorking", label: "Impressora não imprime" },
    { value: "computerSlow", label: "Computador está lento" },
    { value: "softwareNotWorking", label: "Software não está funcionando" },
    { value: "cantConnect", label: "Não consigo conectar à rede" },
    { value: "emailNotSending", label: "E-mail não está sendo enviado" },
    { value: "hardwareBroken", label: "Hardware quebrado" },
    { value: "other", label: "Outro problema (explique na descrição)" },
  ];
  const router = useRouter();
  function handleChangeFiles(e) {
    const filesArray = Array.from(e.target.files);

    const renamedFiles = filesArray.map((file) => {
      const uuid = v4();
      return new File([file], `${uuid}.${file.type.split("/")[1]}`, file);
    });
    console.log(renamedFiles);
    setFiles(renamedFiles);
  }
  const onSubmit = async (data) => {
    setLoading(true);
    data.followUp = checked;
    const user = auth.currentUser;
    if (!user) {
      console.error("User not defined!");
      return;
    }

    data.currentUser = user.displayName || user.email;
    data.prints = files;

    data.id = v4();

    data.createdAt = new Date().toISOString();

    try {
      const referenciaDataBase = ref(database, `/chamados/${data.id}`);
      const uploadTasks = files.reduce(async (accPromise, file) => {
        const acc = await accPromise;
        try {
          const fileId = v4();
          const referenciaFile = storageRef(
            storage,
            `/chamados/${data.id}/prints/${fileId}`
          );
          await uploadBytes(referenciaFile, file, { contentType: file.type });
          const url = await getDownloadURL(referenciaFile);
          acc[fileId] = { url, id: fileId };
          return acc;
        } catch (error) {
          throw new Error(`Erro ao processar arquivo: ${error.message}`);
        }
      }, Promise.resolve({}));
      const uploadUrls = await uploadTasks;
      data.prints = uploadUrls;
      await set(referenciaDataBase, data);
      console.log(data);
      toast({
        title: "Chamado registrado com sucesso!",
        description:
          "Seu chamado foi registrado com sucesso! Aguardamos até 4 dias úteis para resolução e 24 horas para o primeiro retorno.",
        variant: "success",
      });
    } catch (error) {
      console.error(`Erro ao fazer upload de arquivos: ${error.message}`);
      throw error;
    } finally {
      reset();
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="w-[150px] rounded-md shadow-sm text-sm bg-indigo-600 hover:bg-indigo-600/80 text-white py-2 ">
        Abrir chamado
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Abrindo um chamado </SheetTitle>
          <SheetDescription>
            Abra um chamado para reportar um problema ou solicitar ajuda em
            qualquer setor.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-2 py-4"
        >
          <div className="space-y-2 w-full">
            <Label>Setor:</Label>

            <Select onValueChange={(e) => setValue("setor", e)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um setor" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem value={sector.value} key={sector.value}>
                    {sector.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label>Prints</Label>
            <Input
              type="file"
              multiple
              accept=".jpg, .png, .jpeg"
              onChange={handleChangeFiles}
            />
          </div>
          <div className="space-y-2 w-full">
            <Label>Tipo de problema:</Label>
            <Select onValueChange={(e) => setValue("issueType", e)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                {internalProblems.map((internalProblem) => (
                  <SelectItem
                    value={internalProblem.value}
                    key={internalProblem.value}
                  >
                    {internalProblem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Descrição do problema:</Label>
            <Textarea
              {...register("problemDescription")}
              className="h-[250px]"
            />
          </div>
          <div className="flex items-center gap-2 py-2">
            <Switch checked={checked} onCheckedChange={(e) => setChecked(e)} />
            <Label>Acompanhar chamado:</Label>
          </div>
          <Button disabled={loading} type="submit">
            {loading ? "Registrando chamado..." : "Abrir chamado"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
