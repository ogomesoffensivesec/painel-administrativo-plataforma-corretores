"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUsers from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

function Detalhes({ open, setOpen }) {
  const { user } = useUsers();
  const [viewPassword, setViewPassword] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informações do {user && user.name}</DialogTitle>
        </DialogHeader>
        <div className="w-full ">
          <div className="w-full flex gap-1">
            <span className="font-semibold text-stone-700">Nome:</span>
            <span>{user && user.name}</span>
          </div>
          <div className="w-full flex gap-1">
            <span className="font-semibold text-stone-700">Telefone:</span>
            <span>{user && user.phone}</span>
          </div>

          <div className="w-full flex gap-1">
            <span className="font-semibold text-stone-700">E-mail:</span>
            <span>{user && user.email}</span>
          </div>
          <div className="w-full flex gap-2 items-center">
            <span className="font-semibold text-stone-700">Senha:</span>
            {viewPassword ? (
              <div className="w-full flex gap-2 items-center justify-between">
                <span>{user && user.password}</span>

                <Button
                  className="ml-5"
                  size="sm"
                  type="button"
                  onClick={() => setViewPassword(!viewPassword)}
                >
                  <Eye size={12} className="text-white " />
                </Button>
              </div>
            ) : (
              <div className="w-full flex gap-2 items-center justify-between">
                <span>*******</span>
                <Button
                  size="sm"
                  type="button"
                  onClick={() => setViewPassword(!viewPassword)}
                >
                  <Eye size={12} className="text-white" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Detalhes;
