import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { EyeIcon, LayoutDashboard, Pencil, User } from "lucide-react";
import ConfirmaExcluirEmpreendimento from "./empreendimento.excluir.dialog";
import CompartilharCorretores from "./empreendimento.corretores.compartilhar";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "react-query";
import NovoModelo from "./empreendimento.novo.modelo.dialog";

function MenuEmpreendimento({ user, empreendimento }) {
  const queryClient = new QueryClient();
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full flex  justify-between ">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Ações</MenubarTrigger>
            <MenubarContent className="w-[250px] ">
              {/* <MenubarItem className="w-full flex justify-between">
                Editar empreendimento{" "}
                <Pencil size={16} className="text-blue-600" />
              </MenubarItem> */}
              <ConfirmaExcluirEmpreendimento />
              <NovoModelo />
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
    </QueryClientProvider>
  );
}

export default MenuEmpreendimento;
