import { Files, Landmark, Minus, Plus, ShieldAlert } from "lucide-react";
import {
  TopBarMain,
  TopbarItem
} from "@/components/topbar/topbar-pattern";

export default function Drive() {
  return (
    <div className="w-full h-screen">
      <TopBarMain>
        <TopbarItem href="/dashboard/drive/certificados">
          <Files className="h-4 w-4" />
          <span>Certificados</span>
        </TopbarItem>

      </TopBarMain>
    
    </div>
  );
}
