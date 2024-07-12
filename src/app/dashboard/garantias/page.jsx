import { Files, FormInput, Landmark, Minus, Plus, ShieldAlert } from "lucide-react";
import {
  TopBarMain,
  TopbarItem
} from "@/components/topbar/topbar-pattern";

export default function Garantias() {
  return (
    <div className="w-full h-screen">
      <TopBarMain>
        <TopbarItem href="/dashboard/drive/certificados">
          <FormInput className="h-4 w-4" />
          <span>Chamados e ocorrências</span>
        </TopbarItem>

      </TopBarMain>
    
    </div>
  );
}
