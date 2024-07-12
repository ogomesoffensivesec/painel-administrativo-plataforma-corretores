import { ArrowLeftRightIcon, BetweenHorizonalEnd, Building, Hammer, User, Users2Icon } from "lucide-react";
import { TopBarMain, TopbarItem } from "@/components/topbar/topbar-pattern";

export default function Financeiro() {
  return (
    <div className="w-full h-screen">
      <TopBarMain>
        <TopbarItem href="/dashboard/cadastros/empresas">
          <Building className="h-4 w-4" />
          <span>Empresas</span>
        </TopbarItem>
        <TopbarItem href="/dashboard/cadastros/empreendimentos">
          <ArrowLeftRightIcon className="h-4 w-4" />
          <span>Empreendimentos</span>
        </TopbarItem>
        <TopbarItem href="/dashboard/cadastros/imoveis">
          <BetweenHorizonalEnd className="h-4 w-4" />
          <span>Imóveis</span>
        </TopbarItem>
        <TopbarItem href="/dashboard/cadastros/obras">
          <Hammer className="h-4 w-4" />
          <span>Obras</span>
        </TopbarItem>
        <TopbarItem href="/dashboard/cadastros/corretores">
          <Users2Icon className="h-4 w-4" />
          <span>Corretores</span>
        </TopbarItem>
        <TopbarItem href="/dashboard/cadastros/funcionarios">
          <User className="h-4 w-4" />
          <span>Funcionários</span>
        </TopbarItem>
      </TopBarMain>
    </div>
  );
}
