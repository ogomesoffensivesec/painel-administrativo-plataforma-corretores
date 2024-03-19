import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function PriceCard({ price }) {
  return (
    <Card className="w-[300px] ">
      <CardHeader className="p-5">
        <CardTitle>Valor base do imóvel</CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-xl font-semibold text-blue-500">
          {price &&
            parseInt(price).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
        </span>
      </CardContent>
    </Card>
  );
}

export default PriceCard;
