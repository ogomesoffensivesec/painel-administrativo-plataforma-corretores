import {
  TopBarMain,
  TopbarItem
} from "@/components/topbar/topbar-pattern";

export default function Compras() {
  return (
    <div className="w-full h-screen">
      <TopBarMain>
        <TopbarItem href="/dashboard/drive/certificados">
          <FormInput className="h-4 w-4" />
          <span>Pedidos de compra</span>
        </TopbarItem>

      </TopBarMain>
    
    </div>
  );
}
