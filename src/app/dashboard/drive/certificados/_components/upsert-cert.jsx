import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { upsertCertificate } from "./actions";
import { v4 } from "uuid";

export function UpsertCert({ children }) {
  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm();
  const ref = useRef();

  const onSubmit = async (data) => {
    data.id = v4();
    await upsertCertificate(data);
    reset();
    ref.current.click();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button ref={ref}>
          {children}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Insert a digital certificate</SheetTitle>
          <SheetDescription>
            Please select a digital certificate to upload. You can upload a new
            certificate or select one from your existing certificates.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-12">
          <div>
            <Label>Nome:</Label>
            <Input type="text" {...register("name", { required: true })} />
            {errors.name && <span>This field is required</span>}
          </div>
          <div>
            <Label>Arquivo:</Label>
            <Input type="file" accept=".pfx" multiple {...register("file", { required: true })} />
            {errors.file && <span>This field is required</span>}
          </div>
          <div>
            <Label>Data Início:</Label>
            <Input type="date" {...register("createdAt", { required: true })} />
            {errors.createdAt && <span>This field is required</span>}
          </div>
          <div>
            <Label>Data de Validade:</Label>
            <Input type="date" {...register("expirationAt", {
              required: true,
              validate: (value) => value > getValues("createdAt"),
            })} />
            {errors.expirationAt && <span>Data de validade deve ser maior que a data de início</span>}
          </div>
          <div className="w-full flex justify-end">
            <Button size="sm" type="submit">
              Cadastrar Certificado
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
