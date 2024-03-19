import { MoreHorizontal } from "lucide-react";
import React from "react";

// import { Container } from './styles';

function NegotiationActionCard({ update }) {
  console.log(update);
  return (
    <div className={`w-full ${update.proposal !== "" ? "h-40" : "h-28"} bg-white rounded-md shadow-lg flex justify-start border-[1px]  p-0 m-0 mt-2`}>
      <div className="w-[15px] h-full bg-emerald-600 rounded-l-xl m-0 p-0"></div>
      <div className="w-5/6 text-xs p-3 lg:text-sm text-justify">
        <span className="font-bold mr-1">Descrição:</span>
        <span>{update.description}</span>
      </div>
      {update.proposal !== "" && (
        <div className="w-5/6 text-xs p-3 lg:text-sm text-justify">
          <span className="font-bold mr-1">Proposta:</span>
          <span>{update.proposal}</span>
        </div>
      )}
      <div className="w-1/6 flex justify-end p-3"></div>
    </div>
  );
}

export default NegotiationActionCard;
