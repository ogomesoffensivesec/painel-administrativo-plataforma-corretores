import { PlusIcon } from "lucide-react";
import { InserirCompromisso } from "./incluir-compromisso-financeiro/_components/inserir-compromissos";
import { TabelaCompromissos } from "./incluir-compromisso-financeiro/_components/compromissos-table";

export default function Financeiro() {
  return (
    <div className="w-full h-screen p-10">
      <div className="w-full flex items-center justify-between p-2">
        <div className="grid leading-relaxed">
          <span className="font-bold text-2xl text-blue-600">
            Controle Financeiro
          </span>
          <span className="text-muted-foreground">
            Consulte, realize e informe as suas operações financeiras
          </span>
        </div>
        <div className="flex gap-2">
          <InserirCompromisso type='button' >
            <PlusIcon className="h-4 w-4 mr-3" />
            Incluir compromisso
          </InserirCompromisso>
        </div>
      </div>
      <TabelaCompromissos/>
    </div>
  );
}
