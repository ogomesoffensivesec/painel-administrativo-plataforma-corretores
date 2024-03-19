import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useUsers from "@/hooks/useUsers";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import useData from "@/hooks/useData";
import { Label } from "@/components/ui/label";

function CompartilharWhatsapp() {
  const { users } = useUsers();
  const { compartilharWhatsapp } = useData();
  const { register, handleSubmit, setValue } = useForm();

  const enviarMensagem = async (data) => {
    await compartilharWhatsapp(data.phone);
  };
  return (
    <Dialog>
      <DialogTrigger className="relative flex  w-full  cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 justify-between">
        Whatsapp
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar pelo Whatsapp</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(enviarMensagem)}
          className="w-full flex flex-col gap-2 justify-center"
        >
          <Label htmlFor="phone">Selecione o corretor</Label>
          <select
            {...register("phone")}
            className="bg-gray-50 border border-gray-300 text-stone-700 text-sm rounded-md focus:ring-stone-500 focus:border-stone-500 block w-full p-2  dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {users &&
              Object.values(users).map((user) => (
                <option
                  className="cursor-pointer"
                  value={user.phone}
                  key={user.uid}
                >
                  {user && user.name}
                </option>
              ))}
          </select>
          <Button type="submit">Enviar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CompartilharWhatsapp;
