"use client";

import { UsersProvider } from "@/contexts/user.context";
import { auth } from "@/database/config/firebase";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { QueryClient, QueryClientProvider } from "react-query";
import { UpsertCert } from "./_components/upsert-cert";
import { CertificatesTable } from "./_components/table-certificates";

const queryClient = new QueryClient();
export default function Page() {
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
            <div className="w-full mx-auto space-y-4">
              <div className="p-6 w-full mx-auto space-y-4">
                <div className="w-full flex justify-between items-center mb-10">
                  <span className="text-xl font-bold text-indigo-600">
                    Consulta de certificados digitais tipo A1
                  </span>
                  {user?.email === "desenvolvimento@ogcoder.com.br" && (
                    <UpsertCert>Adicionar certificado</UpsertCert>
                  )}
                </div>
                <CertificatesTable />
              </div>
            </div>
          </div>
        </QueryClientProvider>
      </UsersProvider>
    </Suspense>
  );
}
