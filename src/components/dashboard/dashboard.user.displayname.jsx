"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { auth } from "@/database/config/firebase";
import { updateProfile } from "firebase/auth";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

function SetUserDisplayName({ open, setOpenDialogVerifyUser }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const { changeUserData } = useAuth();

  const router = useRouter();
  const salvarNomeUsuario = async () => {
    if (username === "") {
      toast({
        title: "Preencha o nome de usuário para continuar!!",
        variant: "destructive",
      });
      return;
    }
    try {
      await changeUserData(username);
      toast({
        title: "Nome de usuário definido com sucesso!",
        description: "Agora você pode continuiar navegando 😁",
        variant: "success",
      });
      setOpenDialogVerifyUser(false);
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Erro ao definir nome de usuário!",
        variant: "destructive",
      });
    } finally {
      setUsername("");
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você ainda não definiu seu nome de usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 flex flex-col items-end">
          <Input
            type="text"
            value={username}
            placeholder="Nome de usuário"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button type="button" size="sm" onClick={salvarNomeUsuario}>
            Salvar nome de usuário
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SetUserDisplayName;
