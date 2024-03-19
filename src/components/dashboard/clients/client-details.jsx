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
import { useForm } from "react-hook-form";
import { useEffect } from "react";

function ClientDetails({ client }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Set default values when client changes
    setValue("fullName", client.fullName);
    setValue("status", client.status === "active" ? "Ativo" : "Inativo");
    setValue("gender", client.gender);
    setValue("addr", client.addr);
    setValue("email", client.email);
  }, [client, setValue]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="px-6">Detalhe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client.fullName}</DialogTitle>
          <DialogDescription>Editar informações do cliente.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-start gap-2 py-4"
        >
          <div className="flex justify-start items-center gap-4 w-full">
            <Label htmlFor="fullName" className="text-left w-[90px]">
              Nome
            </Label>
            <Input
              id="fullName"
              {...register("fullName", { required: "Nome é obrigatório" })}
              className="col-span-3 w-full"
            />
            {errors.fullName && (
              <span className="text-red-500">{errors.fullName.message}</span>
            )}
          </div>
          <div className="flex justify-start items-center gap-4 w-full">
            <Label htmlFor="status" className="text-left w-[90px]">
              Status
            </Label>
            <Input
              id="status"
              {...register("status")}
              className="col-span-3 w-full"
            />
          </div>

          <div className="flex justify-start items-center gap-4 w-full">
            <Label htmlFor="addr" className="text-left w-[90px]">
              Endereço
            </Label>
            <Input
              id="addr"
              {...register("addr")}
              className="col-span-3 w-full"
            />
          </div>
          <div className="flex justify-start items-center gap-4 w-full">
            <Label htmlFor="email" className="text-left w-[90px]">
              Email
            </Label>
            <Input
              id="email"
              {...register("email", { required: "Email é obrigatório" })}
              className="col-span-3 w-full"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <DialogFooter className="flex justify-end w-full mt-3">
            <Button type="submit">Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ClientDetails;
