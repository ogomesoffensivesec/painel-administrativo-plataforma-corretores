import { Users } from "lucide-react";
import {
  TopBarMain,
  TopbarItem
} from "@/components/topbar/topbar-pattern";

export default function Comercial() {
  return (
    <div className="w-full h-screen">
      <TopBarMain>
        <TopbarItem href="/dashboard/drive/certificados">
          <Users className="h-4 w-4" />
          <span>Visitas aos imóveis</span>
        </TopbarItem>

      </TopBarMain>
    
    </div>
  );
}
