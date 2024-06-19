import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function UpsertActionDemmand({ demmand }) {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [checked, setChecked] = useState(false);

  const handleChangeFiles = (e) => {
    const filesArray = Array.from(e.target.files);
    const renamedFiles = filesArray.map((file) => {
      const uuid = v4();
      return new File([file], `${uuid}.${file.type.split("/")[1]}`, file);
    });
    console.log(renamedFiles);
    setFiles(renamedFiles);
  };

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
      const referenciaDataBase = ref(
        database,
        `/chamados/${demmand.id}/actions/${data.id}`
      );
      const uploadTasks = files.reduce(async (accPromise, file) => {
        const acc = await accPromise;
        try {
          const fileId = v4();
          const referenciaFile = storageRef(
            storage,
            `/chamados/${demmand.id}/actions/${fileId}`
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
        title: "Ação adicionada com sucesso!",
        description: "Sua ação foi adicionada com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error(`Erro ao fazer upload de arquivos: ${error.message}`);
      throw error;
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="border-boder shadow-sm border-[1px]  px-4 py-1 text-xs text-white bg-blue-600 border-blue-600 rounded-sm hover:bg-blue-600/80 duration-500 transition-all">
        Nova movimentação
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nova ação</SheetTitle>
          <SheetDescription>
            Insira uma nova ação para este chamado
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2 w-full">
            <Label>Descrição da ação:</Label>
            <Textarea {...register("description")} className="h-[250px]" />
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
          <div className="flex items-center gap-2 py-2">
            <Switch checked={checked} onCheckedChange={(e) => setChecked(e)} />
            <Label>Acompanhar ação:</Label>
          </div>
          <Button disabled={loading} type="submit">
            {loading ? "Adicionando ação..." : "Adicionar ação"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
