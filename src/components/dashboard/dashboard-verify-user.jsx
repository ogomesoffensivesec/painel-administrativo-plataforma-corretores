"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { v4 } from "uuid";
import useAuth from "@/hooks/useAuth";
import { toast } from "../ui/use-toast";

function VerifyUserDialog({ open, user, setOpenDialogVerifyUser }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    loading,
    setLoading,
    uploadFile,
    setUser,
    writeUserToDatabase,
    handleUser,
  } = useAuth();
  const onSubmit = async (data) => {
    const fileId = v4();
    try {
      setLoading(true);
      const fileUrl = await uploadFile(user.uid, data.file[0], fileId);

      const userData = {
        uid: user.uid,
        name: user.name,
        provider: user.provider,
        phone: data.phone,
        creciFile: fileUrl,
        verify: true,
      };

      await writeUserToDatabase(userData);

      setOpenDialogVerifyUser(false);

      toast({
        title: "Sucesso ao finalizar cadastro!",
        description: "Agora você pode continuar a navegar pela plataforma.",
        variant: "success",
      });

      reset();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete seu cadastro</DialogTitle>
          <DialogDescription>
            Complete as informações para completar seu cadastro de corretor.
          </DialogDescription>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="w-full flex items-center justify-start gap-2">
              <Label htmlFor="phone" className="text-left w-24">
                Telefone
              </Label>
              <Input
                id="phone"
                type="number"
                className="col-span-3"
                {...register("phone", { required: true })}
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
                {...register("file", { required: true })}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Carregando..." : "Finalizar cadastro"}
              </Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default VerifyUserDialog;
