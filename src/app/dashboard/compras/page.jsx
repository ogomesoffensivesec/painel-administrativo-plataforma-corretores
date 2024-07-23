import {
  TopBarMain,
  TopbarItem
} from "@/components/topbar/topbar-pattern";

export default function Compras() {
  return (
    <div className="w-full h-screen">
      <TopBarMain>
        <TopbarItem href="/dashboard/compras/pedidos-e-orcamentos">
          <span>Pedidos de compra</span>
        </TopbarItem>
      </TopBarMain>
    
    </div>
  );
}
