import React from "react";

// import { Container } from './styles';

function Infos({ empreendimento }) {
  return (
    <div className="w-full h-28 mt-4 flex flex-col mx-3">
      <span className="text-xl font-bold text-blue-500">
        {empreendimento.nome}
      </span>
      <span className="text-md font-light text-stone-500 mb-1 capitalize">
        {empreendimento.type}
      </span>
      <span className="text-sm">
        {empreendimento.rua} - {empreendimento.numero}
      </span>
      <span className="text-sm">
        {empreendimento.bairro} - {empreendimento.cidade}
      </span>
    </div>
  );
}

export default Infos;
