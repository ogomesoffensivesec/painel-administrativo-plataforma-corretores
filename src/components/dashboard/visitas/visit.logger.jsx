import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HistoryIcon } from "lucide-react";

function VisitLogger({ visit }) {
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  return (
    <Dialog>
      <DialogTrigger className=" w-[120px] bg-amber-600 inline-flex items-center justify-center whitespace-nowrap rounded-md  font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-3 py-1 text-xs text-white">
        <HistoryIcon size={14} className="mr-1" />
        Histórico
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Histório de ações da visita</DialogTitle>
        </DialogHeader>
        <div className="w-full flex gap-2 items-center ">
          <ul className="w-full space-y-1.5">
            <li className="w-full flex py-2 px-2 text-xs  rounded-md shadow-xs text-stone-600 bg-emerald-100 font-semibold">
              <span className="w-1/4">
                {visit && formatDateTime(visit.createdAt)}
              </span>
              <span className="w-2/4">Visita solicitada com sucesso!</span>
              <span className="w-1/4">{visit.corretor.name}</span>
            </li>
            {visit.log &&
              visit.log.map((logger) => (
                <li
                  key={logger.date}
                  className={`w-full flex py-2 px-2 text-xs font-semibold rounded-md items-center  shadow-xs text-stone-600 
                  ${
                    logger.action === "Tempo da visita expirado!"
                      ? "bg-red-100"
                      : logger.action === "Chaves retiradas"
                      ? "bg-amber-100"
                      : "bg-blue-100"
                  } `}
                >
                  <span className="w-1/4">{formatDateTime(logger.date)}</span>
                  <span className="w-2/4">{logger.action}</span>
                  <span className="w-1/4">{visit.corretor.name}</span>
                </li>
              ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VisitLogger;
