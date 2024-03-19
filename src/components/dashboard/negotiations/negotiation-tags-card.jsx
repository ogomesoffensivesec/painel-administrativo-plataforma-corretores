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

function NegotiationTagsCard({ negotiation }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
        <CardDescription>Todas as tags da negociação </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default NegotiationTagsCard;
