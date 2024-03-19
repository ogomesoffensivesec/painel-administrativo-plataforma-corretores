"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import { DialogClose } from "@radix-ui/react-dialog";
import GoogleIcon from "../../assets/google.png";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import Image from "next/image";

function RegisterDialog({ email }) {
  const { register, handleSubmit, reset } = useForm();
  const [authError, setAuthError] = useState(null);
  const {
    signUp,
    changeUserData,
    uploadFile,
    loading,
    setLoading,
    signInGoogle,
  } = useAuth();

  const onSubmit = async (data) => {
    const uid = v4();
    const fileId = v4();
    try {
      setLoading(true);
      const fileUrl = await uploadFile(uid, data.file[0], fileId);

      const userData = {
        name: data.name,
        phone: data.phone,
        creciFile: fileUrl,
      };

      await signUp(data.email, data.password, userData);
      await changeUserData(userData.name);

      reset();
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="bg-blue-600 dark:text-white text-primary-foreground shadow hover:bg-blue-600/80 h-12 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
        Cadastrar na plataforma
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Acesse agora mesmo!</DialogTitle>
          <DialogDescription>
            Cadastre-se utilizando seu e-mail e senha.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="py-2 w-full space-y-2"
        >
          <div className="w-full flex items-center justify-start gap-2 mb-3">
            <Label htmlFor="email" className="text-left w-24">
              E-mail
            </Label>
            <Input
              id="email"
              className="col-span-3  w-full"
              type="email"
              defaultValue={email}
              {...register("email")}
            />
          </div>
          <div className="w-full flex items-center justify-start gap-2">
            <Label htmlFor="password" className="text-left w-24">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              className="col-span-3"
              {...register("password")}
            />
          </div>
          <div className="w-full flex items-center justify-start gap-2">
            <Label htmlFor="name" className="text-left w-24">
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              className="col-span-3"
              {...register("name")}
            />
          </div>
          <div className="w-full flex items-center justify-start gap-2">
            <Label htmlFor="phone" className="text-left w-24">
              Telefone
            </Label>
            <Input
              id="phone"
              type="number"
              className="col-span-3"
              {...register("phone")}
            />
          </div>
          <div className="w-full flex items-center justify-start gap-2">
            <Label htmlFor="file" className="text-left w-24">
              CRECI
            </Label>
            <Input
              id="file"
              type="file"
              className="col-span-3"
              accept=".pdf, .jpeg, .jpg, .pdf"
              {...register("file")}
            />
          </div>

          <DialogFooter className="h-16 flex items-end">
            <DialogClose>
              <Button variant="destructive">Cancelar</Button>
            </DialogClose>

            <Button type="submit" disabled={loading}>
              {loading ? "Carregando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterDialog;
