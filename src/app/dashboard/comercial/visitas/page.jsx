"use client";

import { InvestimentsFilters } from "@/components/dashboard/empreendimentos/investiments-filter";
import TabelaInvestimentos from "@/components/dashboard/empreendimentos/investiments-table";
import NewNegotiationDialog from "@/components/dashboard/negotiations/new-real-state";
import NewVisitDialog from "@/components/dashboard/visitas/new-visit-dialog";
import ConfiguracoesDaVisita from "@/components/dashboard/visitas/visit.settings.dialog";
import { VisitasFilters } from "@/components/dashboard/visitas/visitas-filter";
import TabelaVisitas from "@/components/dashboard/visitas/visitas-table";
import { AuthProvider } from "@/contexts/auth.context";
import { UsersProvider } from "@/contexts/user.context";
import { auth } from "@/database/config/firebase";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
function Visitas() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user === false) {
      router.push("/");
    }
  }, [user, router]);
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UsersProvider>
            <div className="w-full h-full dark:bg-stone-950 p-10">
              <div className="max-w-7xl mx-auto  space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <VisitasFilters /> <NewVisitDialog />
                  {/* <ConfiguracoesDaVisita /> */}
                </div>
                <div className="p-6 max-w-7xl mx-auto border rounded">
                  <TabelaVisitas />
                </div>
              </div>
            </div>
          </UsersProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default Visitas;
