import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";

function ConfiguracoesDaVisita() {
  // const [date, setDate] = useState();
  // useEffect(() => {
  //   console.log(date);
  // }, [date]);
  // const days = ["Seg", "Terc", "Qua", "Qui", "Sex", "Sab", "Dom"];
  // const months = [
  //   "Janeiro",
  //   "Fevereiro",
  //   "Março",
  //   "Abril",
  //   "Maio",
  //   "Junho",
  //   "Julho",
  //   "Agosto",
  //   "Setembro",
  //   "Outubro",
  //   "Novembro",
  //   "Dezembro",
  // ];

  // const locale = {
  //   localize: {
  //     day: (n) => days[n],
  //     month: (n) => months[n],
  //   },
  //   formatLong: {
  //     date: () => "dd/mm/yyyy",
  //   },
  // };

  return (
    <Dialog>
      <DialogTrigger className="h-9 px-3  border-none outline-none  bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-1 justify-center items-center text-sm">
        <Settings size={16} className="text-white" />
        Configuraçoes
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você tem certeza?</DialogTitle>
          <DialogDescription>
            Essa ação não poderá ser desfeita após a confirmação.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex gap-2 items-center justify-center mt-2">
          {/* <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={locale}
            className="rounded-md border"
          /> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfiguracoesDaVisita;
