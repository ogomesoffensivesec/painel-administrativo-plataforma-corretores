"use client";
import { NegotiationsFilters } from "@/components/dashboard/negotiations/negotiations-filter";
import NegotiationsTable from "@/components/dashboard/negotiations/negotiations-table";
import NewNegotiationDialog from "@/components/dashboard/negotiations/new-real-state";
import { auth } from "@/database/config/firebase";
import { useRouter } from "next/navigation";

import React, { Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
function Negociacoes() {
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
              <NegotiationsFilters />
              <NewNegotiationDialog />
            </div>
            <div className="p-6 max-w-6xl mx-auto border rounded">
              <NegotiationsTable />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </Suspense>
  );
}

export default Negociacoes;
