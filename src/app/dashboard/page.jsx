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

export default function Home() {
  const { user, verifyUser } = useAuth();
  const router = useRouter();
  const [openDialogVerifyUser, setOpenDialogVerifyUser] = useState(false);

  useEffect(() => {
    const verifyUsers = async () => {
      const userVerified = await verifyUser();

      if (!userVerified) {
        setOpenDialogVerifyUser(true);
      }
    };
    if (user === false) {
      router.push("/");
    }
    if (user) {
      verifyUsers();
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return user ? (
    <div className=" w-full p-10  gap-12 flex flex-col flex-wrap bg-stone-100 dark:bg-stone-950">
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
