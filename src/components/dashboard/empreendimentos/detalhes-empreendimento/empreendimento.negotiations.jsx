import { Button } from "@/components/ui/button";
import React from "react";

const formateDate = () => {
  let date = new Date().getMonth();
  if (date < 9) {
    date = "0" + (date + 1);
  }
  return date;
};

const generateFakeArray = (length) => {
  const date = formateDate();
  const fakeArray = [];
  for (let i = 0; i < length; i++) {
    fakeArray.push({
      id: i + 1,
      name: `Item ${i + 1}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, iste sapiente reiciendis unde sint cupiditate quae quam blanditiis consequuntur nesciunt quaerat eaque obcaecati, officia voluptates? Quas deleniti quo earum ad?",
      createdAt: `${new Date().getDate()}/${date}/${new Date().getFullYear()}`,
    });
  }
  return fakeArray;
};

function EmpreendimentoNegotiations() {
  function truncateDescription(description, maxLength) {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  }

  const fakeArray = generateFakeArray(4);
  return (
    <div className="w-full">
      <span className="text-sm font-semibold">
        Resumo das negociações deste imóvel
      </span>
      <ul className="space-y-4 mt-4">
        {fakeArray.map((item, index) => {
          const truncatedDescription = truncateDescription(
            item.description,
            30
          ); // Defina o comprimento máximo que você deseja exibir
          return (
            <li
              className="w-full flex justify-between items-center"
              key={index}
            >
              <span className="md:text-sm">{item.createdAt}</span>
              <span className="md:text-sm">{item.name}</span>
              <span className="md:text-sm text-elipsis text-wrap">
                {" "}
                {truncatedDescription}
              </span>
              <Button type="button" size="sm">
                Acessar negociação
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default EmpreendimentoNegotiations;
