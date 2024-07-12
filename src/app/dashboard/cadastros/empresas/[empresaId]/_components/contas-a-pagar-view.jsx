"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { onValue, ref, set } from "firebase/database";
import { v4 } from "uuid";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "@/components/ui/use-toast";
import { database, storage } from "@/database/config/firebase";
import { ToastAction } from "@/components/ui/toast";
import { ConfirmPayment } from "./confirm-payment-dialog";

export default function ContasPagar({ id }) {
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [checked, setChecked] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    data.paid = checked;

    if (!data.supplier || !data.amount || !data.dueDate) {
      toast({
        title: "Erro ao criar conta a pagar",
        description: "Todos os campos, exceto o anexo, são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(data.dueDate) < new Date(Date.now() - 86400000)) {
      toast({
        title: "Erro ao criar conta a pagar",
        description:
          "A data de vencimento não pode ser menor do que a data atual.",
        action: (
          <ToastAction altText="Cadastrar mesmo assim">
            Estou ciente. Continuar
          </ToastAction>
        ),
        variant: "destructive",
      });
    }

    try {
      const file = data.anexo[0];
      const uuid = v4();
      const renamedFile = new File(
        [file],
        `${uuid}.${file.type.split("/")[1]}`,
        file
      );
      const referenciaDatabase = storageRef(
        storage,
        `/empresas/${id}/invoices/${uuid}`
      );
      await uploadBytes(referenciaDatabase, renamedFile, {
        contentType: file.type,
      });
      const downloadURL = await getDownloadURL(referenciaDatabase);
      const invoiceRef = ref(database, `/empresas/${id}/invoices/${uuid}`);
      await set(invoiceRef, {
        supplier: data.supplier,
        amount: data.amount,
        dueDate: data.dueDate,
        status: "Pendente",
        paid: data.paid,
        anexo: downloadURL,
        id: uuid,
      });
      toast({
        title: "Conta a pagar criada com sucesso!",
        description: "A sua conta a pagar foi criada com sucesso!",
        variant: "success",
      });
      setDrawerOpen(false); // Close the drawer after successful submission
      reset(); // Clear the form fields after successful submission
    } catch (error) {
      console.error("Erro ao criar conta a pagar:", error);
      toast({
        title: "Erro ao criar conta a pagar",
        description: "Ocorreu um erro ao criar a conta a pagar.",
        variant: "destructive",
      });
    }
  };

  const filteredInvoices = () => {
    if (filter === "pending") {
      return invoices.filter((invoice) => !invoice.paid);
    } else if (filter === "paid") {
      return invoices.filter((invoice) => invoice.paid);
    } else {
      return invoices;
    }
  };
  const sortedInvoices = () => {
    return Array.isArray(filteredInvoices())
      ? [...filteredInvoices()].sort((a, b) => {
          if (sortOrder === "asc") {
            return new Date(a.dueDate) - new Date(b.dueDate);
          } else {
            return new Date(b.dueDate) - new Date(a.dueDate);
          }
        })
      : [];
  };

  useEffect(() => {
    const invoicesRef = ref(database, `/empresas/${id}/invoices`);
    onValue(invoicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const invoicesData = snapshot.val();
        const invoicesArray = Object.entries(invoicesData).map(
          ([key, value]) => ({
            ...value,
            id: key,
          })
        );
        setInvoices(invoicesArray);
        console.log(invoicesArray);
      } else {
        setInvoices([]);
      }
    });
  }, [id]);

  return (
    <div className="w-full max-w-8xl py-4 ">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            onClick={() => setFilter("all")}
          >
            Todos
          </Button>
          <Button
            variant={filter === "pending" ? "primary" : "outline"}
            onClick={() => setFilter("pending")}
          >
            Pendentes
          </Button>
          <Button
            variant={filter === "paid" ? "primary" : "outline"}
            onClick={() => setFilter("paid")}
          >
            Pagos
          </Button>
          <Button
            variant={sortOrder === "asc" ? "primary" : "outline"}
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "Ordenar Ascendente" : "Ordenar Descendente"}
          </Button>
        </div>
        <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <DrawerTrigger asChild>
            <Button>Cadastrar nova conta a pagar</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Nova conta a pagar</DrawerTitle>
              <DrawerDescription>
                Preencha os dados da nova conta a pagar.
              </DrawerDescription>
            </DrawerHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-4 py-6 space-y-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Input
                  id="supplier"
                  placeholder="Nome do fornecedor"
                  {...register("supplier", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Valor da conta"
                  {...register("amount", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Data de vencimento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register("dueDate", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="anexo">Anexo</Label>
                <Input id="anexo" type="file" {...register("anexo")} />
              </div>
              <div className=" gap-4 flex items-center ">
                <Switch
                  id="paid"
                  checked={checked}
                  onCheckedChange={(e) => setChecked(e)}
                />
                <Label htmlFor="paid">Pago?</Label>
              </div>
              <DrawerFooter>
                <Button type="submit" className="w-full">
                  Salvar
                </Button>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data de Vencimento</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(sortedInvoices()) &&
            sortedInvoices().map((invoice, index) => (
              <TableRow key={index}>
                <TableCell>{invoice.supplier}</TableCell>
                <TableCell>R${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>{new Date(new Date(invoice.dueDate).getTime() + new Date(invoice.dueDate).getTimezoneOffset() * 60000).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={invoice.paid ? "success" : "warning"}>
                    {invoice.paid ? (
                      "Pago"
                    ) : (
                      <ConfirmPayment id={id} invoiceId={invoice.id} />
                    )}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
