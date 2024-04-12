import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useData from "@/hooks/useData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";

function CompartilharCorretores() {
  const { publicarEmpreendimento, empreendimento, desfazerPublicacao } =
    useData();
  const { handleSubmit, control } = useForm();
  const [open, setOpen] = useState(false);
  const onSubmit = async (formData) => {
    const novoEmpreendimento = {
      ...empreendimento,
      modelos: empreendimento?.modelos.map((modelo) => {
        const novosDocumentos = modelo.documentos.filter((documento) => {
          const isChecked = formData.documentos?.[documento.id];
          return isChecked;
        });

        return {
          ...modelo,
          documentos: novosDocumentos,
        };
      }),
    };

    publicarEmpreendimento(novoEmpreendimento);
  };

  return (
    <Dialog>
      <DialogTrigger
        className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
        data-disabled="pointer-events-none opacity-50"
      >
        Plataforma Corretores
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar na plataforma de corretores</DialogTitle>
          <DialogDescription>
            {!empreendimento.published
              ? "  Selecione os documentos para serem compartilhados com os corretores"
              : "Empreendimento publicado. Clique para desfazer a ação"}
          </DialogDescription>
        </DialogHeader>
        {!empreendimento.published && (
          <div className="w-full flex flex-col">
            <Accordion type="single" collapsible>
              <form onSubmit={handleSubmit(onSubmit)}>
                {empreendimento?.modelos.map((modelo, i) => (
                  <AccordionItem key={modelo.id} value={modelo.id}>
                    <AccordionTrigger>Modelo {i + 1}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {modelo.documentos?.map((documento) => (
                          <li
                            key={documento.id}
                            className="w-full flex justify-between items-center"
                          >
                            <div className="flex gap-1 items-center">
                              <Controller
                                control={control}
                                name={`documentos.${documento.id}`}
                                render={({ field }) => (
                                  <input
                                    type="checkbox"
                                    {...field}
                                    id={`documento-${documento.id}`}
                                    value={documento.name}
                                  />
                                )}
                              />
                              <label htmlFor={`documento-${documento.id}`}>
                                {documento.name}
                              </label>
                            </div>
                            <div className="flex gap-3 items-center">
                              <Button type="button" size="sm">
                                <Link
                                  className="flex gap-1"
                                  href={documento.url}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                >
                                  <Eye size={16} /> Acessar
                                </Link>
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
                <div className="flex gap-12 items-center justify-center mt-3">
                  <DialogClose>Cancelar</DialogClose>
                  <Button type="submit">Publicar empreendimento</Button>
                </div>
              </form>
            </Accordion>
          </div>
        )}
        {empreendimento.published && (
          <Button
            variant="destructive"
            type="button"
            onClick={() => desfazerPublicacao(empreendimento.id)}
          >
            Desfazer publicação
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CompartilharCorretores;
