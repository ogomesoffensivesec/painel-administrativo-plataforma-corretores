import { faker } from "@faker-js/faker";
import { Info } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

function ListComponent() {
  const empreendimentos = [
    {
      title: "Residencial Dona Teka",
      subtitle: "até 19% a.a ou 1,4% a.m",
      status: "ativo",
      banner: faker.image.avatarLegacy(),
      infoIcon: <Info size={24} className="text-blue-500" />,
    },
  ];
  return (
    <>
      {empreendimentos.map((empreendimento) => (
        <div
          key={empreendimento.id}
          className="w-full sm:w-w-full md:w-full lg:w-full xl:w-full h-auto flex items-center bg-white dark:bg-stone-800 border-solid border-[1px] border-stone-400 dark:border-stone-500 rounded-xl p-4 mb-4"
        >
          <div className="w-full sm:w-2/3 h-full flex justify-start gap-3 items-center">
            <Image
              src={empreendimento.banner}
              width={40}
              height={20}
              alt="empreendimento"
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-lg    sm:text-sm md:text-lg  xl:text-lg font-bold">
                {empreendimento.title}
              </span>
              <span className="text-sm text-blue-500">
                {empreendimento.subtitle}
              </span>
            </div>
          </div>
          <div className="h-full flex  items-center sm:flex w-1/3  justify-end px-6">
            <div className="w-26 h-full flex gap-2 justify-center items-center">
              <div className="w-5 h-5 rounded-full bg-emerald-500"></div>
              <span>{empreendimento.status === "ativo" && "Ativo"}</span>
            </div>
            <Button className="ml-4 w-22 h-8 px-6">Investir</Button>
          </div>
        </div>
      ))}
    </>
  );
}

export default ListComponent;
