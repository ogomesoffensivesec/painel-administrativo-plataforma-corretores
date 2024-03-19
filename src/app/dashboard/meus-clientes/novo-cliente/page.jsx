"use client";

import { ClientsFilters } from "@/components/dashboard/clients/clients-filter";
import ClientTable from "@/components/dashboard/clients/clients-table";
import ClientForm from "@/components/dashboard/clients/forms/client-form";
import { Button } from "@/components/ui/button";
import { auth } from "@/database/config/firebase";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function NovoCliente() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (user === false) {
      router.push("/");
    }
  }, [user, router]);
  return (
    <div className="w-full h-full dark:bg-stone-950 p-10 flex justify-center items-center">
      <ClientForm />
    </div>
  );
}

export default NovoCliente;
