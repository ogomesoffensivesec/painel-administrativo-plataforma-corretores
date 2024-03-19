import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { faker } from "@faker-js/faker";

function MeusDadosDashboard() {
  return (
    <div className="w-full flex gap-1 flex-wrap">
      <Card className="border-[1px] w-[270px] border-blue-500 shadow-lg">
        <CardHeader>
          <CardTitle>Seus clientes</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 justify-start items-baseline">
          <span className="text-4xl font-semibold  m-0 p-0 text-blue-600">
            {12}
          </span>
          <span className="text-stone-700">clientes cadastrados</span>
        </CardContent>
      </Card>
      <Card className="border-[1px] w-[260px] border-blue-500 shadow-lg">
        <CardHeader>
          <CardTitle>Suas vendas</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 justify-start items-baseline">
          <span className="text-4xl font-semibold  m-0 p-0 text-blue-600">
            {2}
          </span>
          <span className="text-stone-700">vendas realizadas</span>
        </CardContent>
      </Card>
    </div>
  );
}

export default MeusDadosDashboard;
