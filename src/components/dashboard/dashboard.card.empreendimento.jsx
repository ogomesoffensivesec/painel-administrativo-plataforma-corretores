import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { database } from "@/database/config/firebase";
import { onValue, ref } from "firebase/database";

import { useEffect, useState } from "react";

// import { Container } from './styles';

function EmpreendimentoCard() {
  const [empreendimentos, setEmpreendimentos] = useState([]);
  useEffect(() => {
    const empreendimentosRef = ref(database, "/empreendimentos");
    const unsubscribe = onValue(empreendimentosRef, (snapshot) => {
      if (snapshot.exists()) {
        setEmpreendimentos(Object.values(snapshot.val()));
      } else {
        setEmpreendimentos([]);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    empreendimentos && (
      <Card className="lg:w-[300px]   bg-white dark:bg-stone-800 border-solid border-[1px] border-stone-400 dark:border-stone-500">
        <CardHeader>
          <CardTitle className="text-blue-500 dark:text-blue-400 flex justify-between items-center mb-2">
            <span> Empreendimentos cadastrados</span>
            <span className="text-2xl">🏡</span>
          </CardTitle>
          <CardDescription className="text-stone-500  dark:text-stone-300 text-xs ">
            Todos os seus empreendimentos cadastrados no momento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-3xl  sm:text-md  md:text-2xl   md:font-semibold text-stone-900 dark:text-white">
            {empreendimentos.length} cadastrados
          </span>
        </CardContent>
        {/*
       <CardFooter>
        <div className="flex gap-2 text-stone-900 dark:text-stone-100 text-sm">
          {cardInformation.content.secondaryIcon}
          <div className="w-full flex gap-1 items-center">
            <span>{cardInformation.content.secondary}</span>
            <span className="text-blue-500">
              {cardInformation.content.secondaryEmphasys}
            </span>
          </div>
        </div>
      </CardFooter>
    */}
      </Card>
    )
  );
}

export default EmpreendimentoCard;
