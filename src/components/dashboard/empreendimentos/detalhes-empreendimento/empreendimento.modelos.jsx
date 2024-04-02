import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Expand, Pencil, Save, Trash, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref, update } from "firebase/database";
import { database } from "@/database/config/firebase";
import { toast } from "@/components/ui/use-toast";

function Modelos({ modelos, empreendimentoID }) {
  const [editMode, setEditMode] = useState(false);
  const [editedModel, setEditedModel] = useState(null);
  const [indexModel, setIndexModel] = useState();
  const toggleEditMode = (model, index) => {
    // Verifica se o modelo atual é o mesmo que o modelo em edição
    const isEditing = editedModel && editedModel.id === model.id;

    setEditMode(!isEditing); // Alterna o modo de edição com base no estado atual

    if (!isEditing) {
      setEditedModel(model);
      setIndexModel(index);
    } else {
      setEditedModel(null);
      setIndexModel();
    }
  };

  const saveChanges = async () => {
    try {
      const referenciaModelo = ref(
        database,
        `/empreendimentos/${empreendimentoID}/modelos/${indexModel}`
      );
      await update(referenciaModelo, editedModel);
      toast({
        title: "As alterações do modelo foram salvas com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error(error.message);
      toast({
        title: "Erro ao salvar as alterações do modelo!",
        description:
          "Houve um erro ao salvar as alterações. Tente novamente mais tarde!",
        variant: "destructive",
      });
    } finally {
      setEditMode(!editMode);
      setEditedModel(null);
    }
  };

  const handleInputChange = (field, value) => {
    // Verifica se há um modelo editado
    if (editedModel) {
      // Atualiza o campo correspondente do modelo editado com o novo valor
      setEditedModel({
        ...editedModel,
        [field]: value,
      });
    }
  };

  return (
    <Accordion type="single" collapsible>
      {modelos.map((modelo, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Modelo {index + 1} - clique aqui para expandir
              <Expand size={16} className="text-blue-500 " />
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            {editMode ? (
              <div className="space-y-3 px-1">
                <div>
                  <Label htmlFor={`area_construida-${index}`}>
                    Área Construída:
                  </Label>
                  <Input
                    type="text"
                    id={`area_construida-${index}`}
                    value={editedModel.area_construida}
                    onChange={(e) =>
                      handleInputChange("area_construida", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`area_total-${index}`}>Área Total:</Label>
                  <Input
                    type="text"
                    id={`area_total-${index}`}
                    value={editedModel.area_total}
                    onChange={(e) =>
                      handleInputChange("area_total", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`quartos_simples-${index}`}>
                    Quartos simples:
                  </Label>
                  <Input
                    type="text"
                    id={`quartos_simples-${index}`}
                    value={editedModel.quartos_simples}
                    onChange={(e) =>
                      handleInputChange("quartos_simples", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`suites-${index}`}>Suítes:</Label>
                  <Input
                    type="text"
                    id={`suites-${index}`}
                    value={editedModel.suites}
                    onChange={(e) =>
                      handleInputChange("suites", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`banheiros-${index}`}>Banheiros:</Label>
                  <Input
                    type="text"
                    id={`banheiros-${index}`}
                    value={editedModel.banheiros}
                    onChange={(e) =>
                      handleInputChange("banheiros", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`vagas-${index}`}>Vagas:</Label>
                  <Input
                    type="text"
                    id={`vagas-${index}`}
                    value={editedModel.vagas}
                    onChange={(e) => handleInputChange("vagas", e.target.value)}
                  />
                </div>
                <div className="w-full flex justify-end py-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setEditMode(false);
                      setEditedModel(null);
                    }}
                    className="flex gap-1  px-3 py-1 items-center justify-center text-blue-500 border-[1px] border-blue-500"
                  >
                    <Undo size={15} />
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    onClick={saveChanges}
                    className="flex gap-1  px-3 py-1 items-center justify-center text-white"
                  >
                    <Save size={16} color="white" /> Salvar alterações
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <span className="font-semibold">Área Construída: </span>
                  <span>{modelo["area_construida"]}m²</span>
                </div>
                <div>
                  <span className="font-semibold">Área Total: </span>
                  <span>{modelo["area_total"]}m²</span>
                </div>
                <div>
                  <span className="font-semibold">Quartos simples: </span>
                  <span>{modelo["quartos_simples"]} quartos simples</span>
                </div>
                <div>
                  <span className="font-semibold">Suítes: </span>
                  <span>
                    {modelo["suites"]} suite{modelo["suites"] > 1 && "s"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Banheiros: </span>
                  <span>
                    {modelo["banheiros"]} banheiro
                    {modelo["banheiros"] > 1 && "s"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Vagas: </span>
                  <span>{modelo.vagas} </span>
                </div>
              </>
            )}
            {!editMode && (
              <div className="flex justify-end gap-2 mt-5">
                <Button
                  type="button"
                  size="xs"
                  variant="destructive"
                  className="flex gap-1  px-3 py-1 items-center justify-center text-white"
                >
                  <Trash size={14} />
                  <span className="text-xs font-semibold">Excluir modelo</span>
                </Button>
                <Button
                  type="button"
                  size="xs"
                  className="flex gap-1  px-3 py-1 items-center justify-center text-white"
                  onClick={() => toggleEditMode(modelo, index)}
                >
                  <Pencil size={14} />
                  <span className="text-xs font-semibold">Editar modelo</span>
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default Modelos;
