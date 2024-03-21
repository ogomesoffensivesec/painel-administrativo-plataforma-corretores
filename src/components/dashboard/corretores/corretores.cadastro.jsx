"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Copy, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
function CadastroCorretor() {
  const [password, setPassword] = useState("");
  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    if (!data.nome || !data.phone || !data.creci || !data.email) {
      toast({
        title: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    console.log(data);
  };

  function gerarSenha() {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let senha = "";
    for (let i = 0; i < 8; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      senha += caracteres.charAt(indice);
    }
    if (senha !== "") {
      setPassword(senha);
      return senha;
    }
  }

  const passwordRef = useRef(null);
  function copyPassword() {
    if (passwordRef.current) {
      const range = document.createRange();
      range.selectNode(passwordRef.current);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
    }
    toast({
      title: "Senha copiada",
      variant: "success",
    });

    setPassword("");
  }
  return (
    <Dialog>
      <DialogTrigger className="h-9 px-3  border-none outline-none w-[220px] bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-1 justify-center items-center text-sm">
        <User size={14} className="mr-1" />
        Novo corretor
      </DialogTrigger>

      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col  gap-5 justify-start items-center"
        >
          <DialogHeader>
            <DialogTitle>Cadastro de corretor</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="personal-data" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="personal-data">Dados pessoais</TabsTrigger>
              <TabsTrigger value="plataform-credentials">
                Acesso a plataforma
              </TabsTrigger>
            </TabsList>
            <TabsContent value="personal-data">
              <Card className="p-2">
                <CardContent className="space-y-5">
                  <div className="w-full flex flex-col gap-2">
                    <Label>Nome completo</Label>
                    <Input
                      type="text"
                      id="nome"
                      placeholder="Nome completo do corretor"
                      {...register("nome")}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <Label>Número para contato</Label>
                    <Input
                      type="number"
                      id="phone"
                      placeholder="
                      11 9xxxx-xxxx"
                      {...register("phone")}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <Label>Registro CRECI</Label>
                    <Input
                      type="text"
                      id="creci"
                      placeholder="Registro CRECI"
                      {...register("creci")}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <Label>Documento escaneado</Label>
                    <Input
                      type="file"
                      id="creciFile"
                      accept=".pdf, .png, .jpg,.jpeg"
                      {...register("creciFile")}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="plataform-credentials" className="space-y-5">
              <Card className="pt-5">
                <CardContent className="space-y-3">
                  <div className="w-full flex flex-col gap-2">
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="seuemail@aqui.com.br"
                      {...register("email")}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    {password === "" ? (
                      <Button
                        type="button"
                        className="gap-2"
                        size="sm"
                        onClick={gerarSenha}
                      >
                        Gerar senha <Lock size={16} color="white"></Lock>
                      </Button>
                    ) : (
                      <div className="w-full flex gap-2 justify-start items-center">
                        <span className=" text-sm  text-stone-800">
                          Senha gerada:
                        </span>
                        <span
                          className=" text-sm font-semibold text-stone-700"
                          ref={passwordRef}
                        >
                          {password}
                        </span>
                        <Button
                          onClick={copyPassword}
                          type="button"
                          size="xs"
                          className="flex gap-1 ml-5 px-2 py-2 items-center cursor-pointer"
                        >
                          <Copy size={12} color="white" />
                          <span className="text-xs text-[10px] ">
                            Clique para copiar
                          </span>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <DialogFooter className=" w-full flex justify-end">
            <Button type="submit">Cadastrar corretor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CadastroCorretor;
