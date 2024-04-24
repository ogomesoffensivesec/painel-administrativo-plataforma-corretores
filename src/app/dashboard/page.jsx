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
    <div className=" w-full p-10  gap-12 flex flex-col flex-wrap bg-stone-100 dark:bg-stone-950">
      <SetUserDisplayName
        open={openDialogVerifyUser}
        setOpenDialogVerifyUser={setOpenDialogVerifyUser}
      />
      <div className="w-full flex justify-between  gap-3 md:gap-4 lg:gap-3 flex-wrap">
        {" "}
        <div className="flex gap-3">
          <EmpreendimentoCard />
          <VisitasCard />
        </div>
        <div>
          <Popover>
            <PopoverTrigger className="flex items-center justify-center gap-3">
              <Bell
                size={24}
                strokeWidth={2}
                className="text-blue-600 font-bold"
                fill="#2563eb"
              />
            </PopoverTrigger>
            <PopoverContent>
              {/* <DashboardNotifications  notifications={notifications}/> */}
              Aqui ficará o componente de notificações
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="w-full flex gap-10 flex-col ">
        <DashboardVisit />
        {/* <DashboardNotifications notifications={notifications} /> */}
      </div>
    </div>
  ) : (
    <div className="h-screen w-full p-10  gap-12 flex items-center justify-center bg-stone-100 dark:bg-stone-950">
      <span>Carregando informações...</span>
    </div>
  );
}
