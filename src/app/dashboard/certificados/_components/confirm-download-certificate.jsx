"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ConfirmDownloadCertificate({ file }) {


  async function downloadAndTrackUser() {
   window.open(file.url, "_blank");
  }

  return (
    <Dialog>
      <DialogTrigger className="text-left ">{file.name}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar donwload do certificado</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja baixar o certificado {file.name}?
          </DialogDescription>
          <div className="w-full flex justify-center gap-4 py-3">
            <Button className="w-[170px]" onClick={downloadAndTrackUser}>
              Baixar
            </Button>
            <DialogClose className="w-[170px] rounded-md shadow-md bg-destructive text-white text-sm">
              Cancelar
            </DialogClose>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
