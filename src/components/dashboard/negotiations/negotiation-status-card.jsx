import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Container } from './styles';

function NegotiationStatusCard({negotiation}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
        <CardDescription>Todos os documentos envolvidos na negocicação</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default NegotiationStatusCard;
