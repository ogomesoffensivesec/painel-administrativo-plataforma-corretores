"use client";

import DashboardVisit from "@/components/dashboard/dashboard-mark-visit";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EmpreendimentoCard from "@/components/dashboard/dashboard.card.empreendimento";
import VisitasCard from "@/components/dashboard/dashboard.card.visitas";
import { auth } from "@/database/config/firebase";
import SetUserDisplayName from "@/components/dashboard/dashboard.user.displayname";
import { UsersProvider } from "@/contexts/user.context";
import Imoveis from "./imoveis/page";
import ImoveisCard from "@/components/dashboard/dashboard.card.imovel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChamadosDashboard } from "@/components/dashboard/dashboard-chamados-count";

export default function Home() {
  const { user, openDialogVerifyUser, setOpenDialogVerifyUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const verificarDisplayNameUsuario = async () => {
      const usuarioAtual = auth.currentUser;

      if (usuarioAtual && !usuarioAtual.displayName) {
        setOpenDialogVerifyUser(true);
      }
    };
    if (user === false) {
      router.push("/");
    }
    if (user) {
      verificarDisplayNameUsuario();
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return user ? (
    <div className=" w-full h-screen p-10  gap-4 flex flex-col flex-wrap bg-stone-100 dark:bg-stone-950">
      <UsersProvider>
        <SetUserDisplayName
          open={openDialogVerifyUser}
          setOpenDialogVerifyUser={setOpenDialogVerifyUser}
        />
        <div className="w-full flex justify-between  gap-3 md:gap-4 lg:gap-3 flex-wrap">
          {" "}
          <div className="flex gap-3">
            <EmpreendimentoCard />
            <ImoveisCard />

            <VisitasCard />
          </div>
          <div>
            <Popover>
              <PopoverTrigger className="flex items-center bg-blue-100 rounded-full p-2 justify-center gap-3">
                <Bell
                  size={16}
                  strokeWidth={2}
                  className="text-blue-600 font-bold"
                  fill="#2563eb"
                />
              </PopoverTrigger>
              <PopoverContent>
                Aqui ficará o componente de notificações
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="w-full flex gap-4">
          <div className="w-[637px] ">
            <Card>
              <CardHeader className="text-2lg text-blue-600 pb-3 font-bold ">
                Agendar visita ao imóvel
              </CardHeader>
              <CardContent>
                <DashboardVisit />
              </CardContent>
            </Card>
          </div>
          {/* <div className="w-[307px]">
            <Card>
              <CardHeader className="text-2lg text-blue-600 pb-3 font-bold ">
                Chamados de garantia
              </CardHeader>
              <CardContent>
                <ChamadosDashboard />
              </CardContent>
            </Card>
          </div> */}
        </div>
      </UsersProvider>
    </div>
  ) : (
    <div className="h-screen w-full p-10  gap-12 flex items-center justify-center bg-stone-100 dark:bg-stone-950">
      <span>Carregando informações...</span>
    </div>
  );
}
