"use client";
import React from "react";
import NewConversationDialog from "./new-conversation-dialog";


function NegotiationDetailsHeader({ negotiation }) {
  return (
    <div className="w-full h-24  p-6 flex justify-between items-center ">
      <span className="font-bold text-xl text-stone-800">
        Acompanhamento de negociação 

      </span>
      <NewConversationDialog negotiation={negotiation} />
    </div>
  );
}

export default NegotiationDetailsHeader;
