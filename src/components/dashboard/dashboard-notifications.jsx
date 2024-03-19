"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function DashboardNotifications({notifications}) {
  const [messageDaysList, setMessageDaysList] = useState([]);

  

  useEffect(() => {
    const daysAgoList = notifications.map((notification) => {
      const dataAtual = new Date();
      const partes = notification.createdAt.split("/");
      const ano = parseInt(partes[2]);
      const mes = parseInt(partes[1]) - 1; // Subtrai 1 do mês
      const dia = parseInt(partes[0]);
      const minhaData = new Date(ano, mes, dia);
      console.log(minhaData);
      const diferencaEmMilissegundos = dataAtual - minhaData;
      const umDiaEmMilissegundos = 1000 * 60 * 60 * 24;
      const diferencaEmDias = Math.floor(
        diferencaEmMilissegundos / umDiaEmMilissegundos
      );
      return formatDaysAgo(diferencaEmDias);
    });
    setMessageDaysList(daysAgoList);
  }, []);

  const formatDaysAgo = (differenceInDays) => {
    if (differenceInDays === 1) {
      return "1 dia atrás";
    } else if (differenceInDays <= 30) {
      return `${differenceInDays} dias atrás`;
    } else if (differenceInDays <= 60) {
      return "1 mês atrás";
    } else {
      const differenceInMonths = Math.floor(differenceInDays / 30);
      return `${differenceInMonths} meses atrás`;
    }
  };

  return (
    <div className="w-full min-h-64">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className='no-underline py-2'>
            <div className="w-full flex gap-1.5">
              <span className="text-xl font-bold text-stone-800 dark:text-white">
                Últimas notificações
              </span>
              <div className=" bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center">
                <span className="text-[10px] text-blue-400">
                  {notifications.length}
                </span>
              </div>
            </div>
          </AccordionTrigger>

          <ul className="w-full">
            <AccordionContent>
              {notifications.map((not, index) => (
                <li
                  className="w-full flex gap-4 items-center justify-between py-1 mb-1"
                  key={not.createdAt}
                >
                  <div className="w-8 text-center">
                    <span className="text-xl">{not.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl md:text-[15px] font-bold text-blue-500 leading-6">
                      {not.title}
                    </span>
                    <span
                      className="text-xs"
                      dangerouslySetInnerHTML={{ __html: not.description }}
                    ></span>
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-xs">{messageDaysList[index]}</span>
                  </div>
                </li>
              ))}
            </AccordionContent>
          </ul>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default DashboardNotifications;
