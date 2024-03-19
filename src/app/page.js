"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/database/config/firebase";
import useAuth from "@/hooks/useAuth";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";

function Home() {
  const [notAuth, setNotAuth] = useState(false);
  const [user] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    } else {
      setNotAuth(true)
    }
  }, [user])
  const { register, handleSubmit, reset } = useForm();
  const { signIn, loading } = useAuth();
  const router = useRouter()


  const onSubmit = async (data, e) => {
    e.preventDefault();
    if (data.email === "" || data.password === "") {
      toast({
        title: "Preencha email e senha para autenticar",
        description: "Revise os dados e prossiga",
        variant: "destructive",
      });
      return;
    }
    try {
      await signIn(data.email, data.password);

      reset();
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    notAuth && <Dialog open={open}>
      {/* <DialogTrigger asChild>
        <Button>Entrar na plataforma</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Acesse agora mesmo!</DialogTitle>
          <DialogDescription>
            Autentique sua conta utilizando seu e-mail e senha.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="w-full flex items-center justify-start gap-2">
            <Label htmlFor="email" className="text-left w-24">
              E-mail
            </Label>
            <Input
              id="email"
              className="col-span-3  w-full"
              type="email"
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

          <DialogFooter>
            <div className="flex w-full justify-end gap-3">
              <DialogClose>
                <Button variant="destructive" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">
                {loading ? "Carregando..." : "Autenticar"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Home;
