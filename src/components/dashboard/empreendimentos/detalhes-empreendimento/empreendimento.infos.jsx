import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Save, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref, update } from "firebase/database";
import { database } from "@/database/config/firebase";
import { toast } from "@/components/ui/use-toast";

function Infos({ empreendimento }) {
  const [editMode, setEditMode] = useState(false);
  const [editedEmpreendimento, setEditedEmpreendimento] = useState(null);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedEmpreendimento(empreendimento);
  };

  const saveChanges = async () => {
    try {
      console.log("Atualizando...");
      const referenciaEmpreentimento = ref(
        database,
        `/empreendimentos/${empreendimento.id}`
      );
      await update(referenciaEmpreentimento, editedEmpreendimento);
      toast({
        title: "Alterações salvas com sucesso",
        description:
          "As informações do empreendimento foram salvas com sucesso",
        variant: "success",
      });
      setEditMode(false);
    } catch (error) {
      console.error(error.message);
      toast({
        title: "Erro ao salvar alterações",
        description:
          "Houve um erro ao salvar as alterações. Tente novamente em alguns instantes!",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="w-full h-28 mt-4 flex flex-col mx-3">
      {editMode ? (
        <>
          {/* Campos de edição */}
          <div className="w-full flex gap-1 justify-center">
            <div className="w-full flex gap-1 flex-col my-2">
              <Label className="text-xs" htmlFor="nome">
                Nome:
              </Label>
              <Input
                type="text"
                id="nome"
                value={editedEmpreendimento.nome}
                onChange={(e) =>
                  setEditedEmpreendimento({
                    ...editedEmpreendimento,
                    nome: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full flex gap-1 flex-col my-2">
              <Label className="text-xs" htmlFor="type">
                Tipo:
              </Label>
              <Input
                type="text"
                id="type"
                value={editedEmpreendimento.type}
                onChange={(e) =>
                  setEditedEmpreendimento({
                    ...editedEmpreendimento,
                    type: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="w-full flex gap-1 justify-center">
            <div className="w-full flex gap-1 flex-col my-2">
              <Label className="text-xs" htmlFor="rua">
                Rua:
              </Label>
              <Input
                type="text"
                id="rua"
                value={editedEmpreendimento.rua}
                onChange={(e) =>
                  setEditedEmpreendimento({
                    ...editedEmpreendimento,
                    rua: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full flex gap-1 flex-col my-2">
              <Label className="text-xs" htmlFor="numero">
                Número:
              </Label>
              <Input
                type="text"
                id="numero"
                value={editedEmpreendimento.numero}
                onChange={(e) =>
                  setEditedEmpreendimento({
                    ...editedEmpreendimento,
                    numero: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="w-full flex gap-1 justify-center">
            <div className="w-full flex gap-1 flex-col my-2">
              <Label className="text-xs" htmlFor="bairro">
                Bairro:
              </Label>
              <Input
                type="text"
                id="bairro"
                value={editedEmpreendimento.bairro}
                onChange={(e) =>
                  setEditedEmpreendimento({
                    ...editedEmpreendimento,
                    bairro: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full flex gap-1 flex-col my-2">
              <Label className="text-xs" htmlFor="cidade">
                Cidade:
              </Label>
              <Input
                type="text"
                id="cidade"
                value={editedEmpreendimento.cidade}
                onChange={(e) =>
                  setEditedEmpreendimento({
                    ...editedEmpreendimento,
                    cidade: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="w-full flex justify-center mt-2  gap-2 pb-4 ">
            <Button
              size="xs"
              type="button"
              variant="outline"
              className="px-4 py-1 gap-1 flex  text-xs"
              onClick={() => setEditMode(!editMode)}
            >
              <Undo size="14" />
              Voltar
            </Button>
            <Button
              size="xs"
              type="button"
              className="px-2 py-1 gap-1 flex text-white text-xs"
              onClick={saveChanges}
            >
              <Save size="14" />
              Salvar alterações
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Dados do empreendimento */}
          <div className="w-full flex gap-1 justify-between my-2">
            <span className="text-xl font-bold text-blue-500">
              {empreendimento.nome}
            </span>
            <Button
              type="button"
              size="xs"
              className="flex gap-1 items-center justify-center text-white text-xs px-3"
              onClick={toggleEditMode}
            >
              <Pencil size={12} />
              <span className="font-semibold">Editar</span>
            </Button>
          </div>
          <span className="text-md font-light text-stone-500 mb-1 capitalize">
            {empreendimento.type}
          </span>
          <span className="text-sm">
            {empreendimento.rua} - {empreendimento.numero}
          </span>
          <span className="text-sm">
            {empreendimento.bairro} - {empreendimento.cidade}
          </span>
        </>
      )}
    </div>
  );
}

export default Infos;
