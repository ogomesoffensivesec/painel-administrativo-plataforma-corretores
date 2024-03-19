"use client";
import CancelNegotiationDialog from "@/components/dashboard/negotiations/cancel-negotiation-dialog";
import NegotiationClientCard from "@/components/dashboard/negotiations/negotiation-client-card";
import NegotiationCard from "@/components/dashboard/negotiations/negotiation-client-card";
import NegotiationDetails from "@/components/dashboard/negotiations/negotiation-details";
import NegotiationDetailsHeader from "@/components/dashboard/negotiations/negotiation-details.header";
import NegotiationStatusCard from "@/components/dashboard/negotiations/negotiation-status-card";
import NegotiationTagsCard from "@/components/dashboard/negotiations/negotiation-tags-card";
import { getNegotiationById } from "@/components/dashboard/negotiations/negotiations-data";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/database/config/firebase";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function Page({ params }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  if (!user) router.push("/");

  const [negotiation, setNegotiation] = useState();
  useEffect(() => {
    const fetchNegotiationById = async () => {
      const paramId = params.negociacaoId;
      try {
        const negotiationFetched = await getNegotiationById(paramId);
        setNegotiation(negotiationFetched);
        console.log(negotiationFetched);
      } catch (error) {
        toast({
          title: "Nenhuma negociação encontrada.",
          description:
            "Não encontramos nenhuma negociação com esse identificador!",
          variant: "destructive",
        });

        setTimeout(() => {
          redirect("/dashboard/negociacoes");
        }, 2000);
      }
    };

    fetchNegotiationById();
  }, []);
  return (
    negotiation && (
      <div className="w-full  p-10 flex flex-col">
        <NegotiationDetailsHeader negotiation={negotiation} />
        <div className="w-full flex gap-3">
          <NegotiationDetails negotiation={negotiation} />
          <div className="w-1/3 p-6 mt-9 flex flex-col gap-3">
            <NegotiationClientCard negotiation={negotiation} />
            <NegotiationStatusCard negotiation={negotiation} />
            <NegotiationTagsCard negotiation={negotiation} />
            <div className="w-full h-full flex items-end justify-end gap-3">
              <CancelNegotiationDialog />
              <Button variant="success">
                Solicitar finalização da negociação
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Page;
