"use client";

import { ClientsFilters } from "@/components/dashboard/clients/clients-filter";
import ClientTable from "@/components/dashboard/clients/clients-table";
import { Button } from "@/components/ui/button";
import { auth } from "@/database/config/firebase";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
function MeusClientes() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (user === null) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <div className="w-full h-full dark:bg-stone-950 p-10">
          <div className="max-w-6xl mx-auto  space-y-4">
            <div className="flex items-center justify-between gap-2">
              <ClientsFilters />
              <Button>
                <Link
                  href="/dashboard/meus-clientes/novo-cliente"
                  className="flex gap-1 justify-center items-center"
                >
                  <PlusCircle size={16} className="mr-1" />
                  Novo cliente
                </Link>
              </Button>
            </div>
            <div className="p-6 max-w-6xl mx-auto border rounded">
              <ClientTable />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </Suspense>
  );
}

export default MeusClientes;
