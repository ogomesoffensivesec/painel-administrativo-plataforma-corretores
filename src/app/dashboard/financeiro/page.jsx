import { Landmark, Minus, Plus, ShieldAlert } from "lucide-react";
import {
  TopBarMain,
  TopbarItem
} from "@/components/topbar/topbar-pattern";

export default function Financeiro() {
  return (
    <div className="w-full h-screen">
      <TopBarMain>
        <TopbarItem href="/dashboard/financeiro/receita">
          <Minus className="h-4 w-4" />
          <span>Receita</span>
        </TopbarItem>
        <TopbarItem href="/dashboard/financeiro/caixa">
          <Plus className="h-4 w-4" />
          <span>Caixa</span>
        </TopbarItem>
        <TopbarItem href="/dashboard/financeiro/conciliacao-bancaria">
          <Landmark className="h-4 w-4" />
          <span>Conciliação bancária</span>
        </TopbarItem>
        <TopbarItem href="/dashboard/financeiro/compromissos-financeiros">
          <ShieldAlert className="h-4 w-4" />
          <span>Compromissos financeiros</span>
        </TopbarItem>
      </TopBarMain>
    
    </div>
  );
}
