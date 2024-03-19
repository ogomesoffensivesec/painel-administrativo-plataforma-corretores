"use client";

import DashboardVisit from "@/components/dashboard/dashboard-mark-visit";
import DashboardNotifications from "@/components/dashboard/dashboard-notifications";
import { Bell, Calendar } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VerifyUserDialog from "@/components/dashboard/dashboard-verify-user";
import EmpreendimentoCard from "@/components/dashboard/dashboard.card.empreendimento";
import VisitasCard from "@/components/dashboard/dashboard.card.visitas";

export default function Home() {
  const { user, verifyUser } = useAuth();
  const router = useRouter();
  const [openDialogVerifyUser, setOpenDialogVerifyUser] = useState(false);

  useEffect(() => {
    const verifyUsers = async () => {
      const userVerified = await verifyUser();
      console.log("Verificado?");
      console.log(userVerified);
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

  const notifications = [
    {
      icon: "🥳",
      title: "IMÓVEL VENDIDO!",
      description:
        "O imóvel MH-CS-AMERICA01 foi vendido!\nA Make Home agradece sua participação durante o processo de venda!",
      createdAt: "17/02/2024",
      followLink: false,
    },
    {
      icon: "❗️",
      title: "NEGOCIAÇÃO EM ANDAMENTO",
      description:
        "Você tem (1) negociação em andamento. Clique aqui e revise-a.",
      createdAt: "12/02/2024",
      followLink: false,
    },
    {
      icon: "👏",
      title: "PROPOSTA ACEITA!",
      description:
        "Parabéns! Sua proposta de compra do imóvel MH-CS-AMERICA01 foi aceita. <br/>Feche a negociação para prosseguir",
      createdAt: "09/02/2024",
      followLink: false,
    },
    {
      icon: "🤦‍♂️",
      title: "PROPOSTA RECUSADA!",
      description:
        "Ah não! Sua proposta de compra do imóvel MH-CS-AMERICA01 foi recusada. <br/>Revise as informações e envie novamente!",
      createdAt: "06/02/2024",
      followLink: false,
    },
  ];

  return user ? (
    <div className=" w-full p-10  gap-12 flex flex-col flex-wrap bg-stone-100 dark:bg-stone-950">
      <VerifyUserDialog
        open={openDialogVerifyUser}
        user={user}
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
