"use client";

import { database } from "@/database/config/firebase";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Shield, UserIcon } from "lucide-react";
import { Button } from "../ui/button";

export function ChamadosDashboard() {
  const [chamadosCount, setChamadosCount] = useState(0);

  useEffect(() => {
    async function getChamados() {
      const chamadosRef = ref(database, "/chamados");
      try {
        const snapshot = await get(chamadosRef);
        if (snapshot.exists()) {
          setChamadosCount(Object.values(snapshot.val()).length);
        } else {
          setChamadosCount(0);
        }
      } catch (error) {
        console.error("Error fetching chamados count:", error);
        setChamadosCount(0);
      }
    }

    getChamados();
  }, []);

  return (
    <div className="w-full flex flex-col  h-[150px]">
      <div className="flex items-center gap-4">
        <div className="bg-secondary rounded-full p-3">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-7xl font-bold">
            {chamadosCount.toString().padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="pt-8 w-full flex justify-end">
        <Button size="sm">Acessar chamados</Button>
      </div>
    </div>
  );
}
