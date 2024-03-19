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

function NegotiationClientCard({negotiation}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cliente: {negotiation.client.fullName}</CardTitle>
        <CardDescription>{negotiation.client.email}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default NegotiationClientCard;
