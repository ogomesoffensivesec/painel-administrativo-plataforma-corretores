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
import { Label } from "@/components/ui/label";
import { Plus, PlusCircle, X } from "lucide-react";
import { getClients } from "../clients/clients-data";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getInvestiments } from "../empreendimentos/investiments-data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ProposalInput } from "@/components/ui/proposal-input";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "react-circular-progressbar/dist/styles.css";
import { LoadingProgress } from "./loading-new-negotiation";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { DialogClose } from "@radix-ui/react-dialog";

function NewConversationDialog({ negotiation }) {
  const schema = Yup.object().shape({
    proposal: Yup.number()
      .transform((value, originalValue) => {
        return originalValue.trim() === "" ? undefined : value;
      })
      .typeError("A proposta deve ser um número."),
    description: Yup.string().required("A descrição é obrigatória."),
  });

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const handleResetFields = () => {
    reset();
    clearErrors("proposal");
  };

  function formatarMoeda(valor) {
    const formated = parseFloat(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return formated;
  }

  const onSubmit = async (data) => {
    const { proposal, description } = data;
    const proposalFormated = formatarMoeda(proposal);
    const update = [
      {
        description: description,
        proposal: proposalFormated,
        createdAt: new Date(),
      },
    ];

    // const newData = {
    //   client: JSON.parse(client),
    //   realState: JSON.parse(realState),
    //   proposal: proposalFormated,
    //   updates,
    // };

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log(update);
      toast({
        title: "Movimentação adicionada!",
        description: "Fique de olho nas atualizações da construtora!",
        action: <ToastAction altText="access-granted">Acessar</ToastAction>,
        variant: "success",
      });
      reset();
    }, 2500);
  };

  return (
    <Dialog>
      <DialogTrigger className="h-9 px-3  w-[200px] bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md flex gap-1 justify-center items-center text-sm">
        <PlusCircle size={14} className="mr-1" />
        Nova movimentação
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova movimentação</DialogTitle>
          <DialogDescription>
            Atualizando uma negociação imobiliária.
          </DialogDescription>
        </DialogHeader>
        {!loading && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-start gap-5 justify-center py-4"
          >
            <div className="flex justify-start items-center gap-4 w-full">
              <Label htmlFor="real-state" className="text-left w-[90px]">
                Imóvel
              </Label>
              <select
                disabled
                id="real-state"
                {...register("realState")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value={negotiation["real-state"]}>
                  {negotiation["real-state"].empreendimento}
                </option>
              </select>
            </div>
            <div className="flex justify-start items-center gap-4 w-full">
              <Label htmlFor="clients" className="text-left w-[90px]">
                Cliente
              </Label>
              <select
                disabled
                id="clients"
                {...register("client")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value={negotiation.client}>
                  {negotiation.client.fullName}
                </option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <div className="flex justify-start items-center gap-4 w-full">
                <Label htmlFor="proposal" className="text-left w-[90px]">
                  Proposta
                </Label>
                <div
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors items-center gap-1"
                  )}
                >
                  <span className="text-muted-foreground">R$</span>
                  <ProposalInput
                    id="proposal"
                    {...register("proposal", { required: false })}
                    className="col-span-3 w-full  "
                    placeholder="Valor da proposta do cliente"
                  />
                </div>
              </div>
              {errors.proposal && (
                <span className="text-red-500 text-xs mt-1 text-right">
                  {errors.proposal.message}
                </span>
              )}
            </div>

            <div className="flex flex-col w-full">
              <div className="flex justify-start items-center gap-4 w-full">
                <Label htmlFor="description" className="text-left w-[90px]">
                  Descrição
                </Label>
                <Input
                  id="description"
                  {...register("description", { required: false })}
                  className="col-span-3 w-full"
                  placeholder="Adicione uma observação/nota"
                />
              </div>
              {errors.description && (
                <span className="text-red-500 text-xs mt-1 text-right">
                  {errors.description.message}
                </span>
              )}
            </div>

            <DialogFooter className="flex justify-end w-full mt-3">
              <Button
                type="submit"
                className="flex justify-center items-center gap-1 "
              >
                <Plus size={16} />
                Nova movimentação
              </Button>
              <DialogClose
                onClick={handleResetFields}
                type="button"
                className="flex items-center justify-center gap-1 bg-destructive px-3 rounded-md text-white"
              >
                <X size={16} /> Cancelar
              </DialogClose>
            </DialogFooter>
          </form>
        )}

        {loading && <LoadingProgress />}
      </DialogContent>
    </Dialog>
  );
}

export default NewConversationDialog;
