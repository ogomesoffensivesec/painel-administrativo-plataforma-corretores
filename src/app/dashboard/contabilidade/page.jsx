import { TopBarMain, TopbarItem } from "@/components/topbar/topbar-pattern";

export default function Contabilidade() {
  return (
    <div className="w-full h-screen">
      <TopBarMain>
        <TopbarItem href="/dashboard/contabilidade/">
          Aqui ficará as ferramentas do setor contábil
        </TopbarItem>
      </TopBarMain>
    </div>
  );
}
