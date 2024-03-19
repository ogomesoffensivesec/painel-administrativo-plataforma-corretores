import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

function Modelos({ modelos }) {
  return (
    <Accordion type="single" collapsible>
      {modelos.map(
        (
          modelo,
          index // Adicionando um index para garantir valores únicos
        ) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>
              <span>
                {"R$ " +
                  modelo.price.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
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
                  {modelo["banheiros"]} banheiro{modelo["banheiros"] > 1 && "s"}
                </span>
              </div>
              <div>
                <span className="font-semibold">Vagas: </span>
                <span>
                  {modelo["vagas"]} vaga{modelo["vagas"] > 1 && "s"}
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      )}
    </Accordion>
  );
}

export default Modelos;
