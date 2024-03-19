"use client";

import { CorretoresFilter } from "@/components/dashboard/corretores/corretores.filter";
import TabelaCorretores from "@/components/dashboard/corretores/corretores.table";
import NewNegotiationDialog from "@/components/dashboard/negotiations/new-real-state";
import { UsersProvider } from "@/contexts/user.context";
import { auth } from "@/database/config/firebase";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
function Corretores() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user === false) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <Suspense>
      <UsersProvider>
        <QueryClientProvider client={queryClient}>
          <div className="w-full h-full dark:bg-stone-950 p-10">
            <div className="max-w-6xl mx-auto  space-y-4">
              <div className="flex items-center justify-between gap-2">
                <CorretoresFilter /> <NewNegotiationDialog />
              </div>
              <div className="p-6 max-w-6xl mx-auto border rounded">
                <TabelaCorretores />
              </div>
            </div>
          </div>
        </QueryClientProvider>
      </UsersProvider>
    </Suspense>
  );
}

export default Corretores;
