import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import useData from "@/hooks/useData";
import { EyeIcon, Pencil, Trash, User } from "lucide-react";
import React from "react";
import ConfirmaExcluirEmpreendimento from "./empreendimento.excluir.dialog";
import CompartilharCorretores from "./empreendimento.corretores.compartilhar";
import EditarEmpreendimento from "./empreendimento.editar";
import CompartilharWhatsapp from "./empreendimento.whatsapp.compartilhar";
import { useRouter } from "next/navigation";

function MenuEmpreendimento({ user }) {
  const router = useRouter();
  return (
    <div className="w-full flex py-4 justify-between mb-5">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Ações</MenubarTrigger>
          <MenubarContent className="w-[250px] ">
            <EditarEmpreendimento />
            <ConfirmaExcluirEmpreendimento />

            <MenubarItem disabled>Acessar câmeras ao vivo</MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Compartilhar</MenubarSubTrigger>
              <MenubarSubContent>
                <CompartilharCorretores />
                {/* <CompartilharWhatsapp /> */}
                <MenubarItem disabled>Exportar arquivo</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem
              onClick={() => router.push("/dashboard/empreendimentos")}
            >
              Voltar a pagina anterior
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Log</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>Consultar log completo</MenubarItem>
            <MenubarItem disabled>Rastrear ação</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Corretores</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Notificar corretor</MenubarItem>
            <MenubarItem>Consultar negociações</MenubarItem>
            <MenubarItem>Verificar propostas</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger disabled>Notificações</MenubarTrigger>
          {/* <MenubarContent>
              <MenubarRadioGroup value="benoit">
                <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
              </MenubarRadioGroup>
              <MenubarSeparator />
              <MenubarItem inset>Edit...</MenubarItem>
              <MenubarSeparator />
              <MenubarItem inset>Add Profile...</MenubarItem>
            </MenubarContent> */}
        </MenubarMenu>
      </Menubar>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="gap-3">
            <User size={16} className="text-blue-500" /> {user.name}
          </MenubarTrigger>
          <MenubarContent className="w-[230px]">
            <MenubarItem>
              Suas ações
              <MenubarShortcut>
                <EyeIcon size={16} className="text-blue-500" />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Desativar empreendimento</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}

export default MenuEmpreendimento;
