import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAuth from "@/hooks/useAuth";
import { User2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function NegotiationDetails({ negotiation }) {
  const { user } = useAuth();
  const [readMoreArray, setReadMoreArray] = useState(
    Array(negotiation.updates.length).fill(false)
  );
  const [shouldShowButton, setShouldShowButton] = useState(
    Array(negotiation.updates.length).fill(false)
  );
  const { updates } = negotiation;
  const textRef = useRef([]);

  function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  useEffect(() => {
    const updatedShouldShowButton = updates.map((update, index) => {
      if (textRef.current[index]) {
        return (
          textRef.current[index].offsetHeight <
          textRef.current[index].scrollHeight
        );
      }
      return false;
    });
    setShouldShowButton(updatedShouldShowButton);
  }, [updates]);

  const handleReadMoreClick = (index) => {
    const updatedReadMoreArray = [...readMoreArray];
    updatedReadMoreArray[index] = true;
    setReadMoreArray(updatedReadMoreArray);
  };

  const handleReadLessClick = (index) => {
    const updatedReadMoreArray = [...readMoreArray];
    updatedReadMoreArray[index] = false;
    setReadMoreArray(updatedReadMoreArray);
  };

  return (
    <div className="w-2/3 h-full  rounded-md shadow p-6 flex flex-col overflow-hidden ">
      <span className="text-lg font-semibold text-blue-600 flex gap-3">
        Movimentações
        <div className=" bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center">
          <span className="text-[10px] text-blue-400">{updates.length}</span>
        </div>
      </span>
      <ScrollArea className="w-full  md:h-[400px] lg:h-[700px] pr-8">
        {updates.map((update, index) => (
          <div
            key={index}
            className={`w-full  bg-white rounded-md shadow-lg  justify-startp-0 m-0 mt-2 border-[1px] border-blue-500 flex
             flex-col divide-y-[2px]`}
          >
            <div className="w-full  p-4  ">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex items-center gap-2 mb-2">
                  <User2 size={22} className="text-blue-500 " />
                  <span className="text-sm font-semibold">{user.name}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge>Atualizado em {formatDate(update.createdAt)}</Badge>
                  {update.proposal !== "" && (
                    <Badge variant="analysis">Proposta em análise</Badge>
                  )}
                </div>
                <span className="font-bold mr-1">Descrição</span>
              </div>
              <ScrollArea className={`w-full py-1 h-auto `}>
                <span
                  className={`text-xs ${
                    readMoreArray[index] ? "" : "line-clamp-1"
                  }`}
                  ref={(ref) => (textRef.current[index] = ref)}
                >
                  {update.description}
                </span>

                {shouldShowButton[index] && !readMoreArray[index] && (
                  <span
                    className="text-xs text-blue-600 flex justify-end px-14 mt-1 cursor-pointer"
                    onClick={() => handleReadMoreClick(index)}
                  >
                    ver mais....
                  </span>
                )}
                {readMoreArray[index] && (
                  <span
                    className="text-xs text-blue-600 flex justify-end px-14 mt-1 cursor-pointer"
                    onClick={() => handleReadLessClick(index)}
                  >
                    ver menos....
                  </span>
                )}
              </ScrollArea>
            </div>
            {update.proposal !== "" && (
              <div className="w-full text-xs p-3 lg:text-sm flex flex-col ">
                <div className="w-full flex gap-1 items-center ">
                  <span className="font-bold mr-1">Proposta:</span>
                  <span>{update.proposal}</span>
                  <Badge variant="analysis" className="ml-4">
                    Em análise
                  </Badge>
                </div>
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

export default NegotiationDetails;
