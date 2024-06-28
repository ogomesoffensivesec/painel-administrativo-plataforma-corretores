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

function ImoveisCard() {
  const [imoveis, setImoveis] = useState([]);
  useEffect(() => {
    const empreendimentosRef = ref(database, "/imoveis");
    const unsubscribe = onValue(empreendimentosRef, (snapshot) => {
      if (snapshot.exists()) {
        setImoveis(Object.values(snapshot.val()));
      } else {
        setImoveis([]);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    imoveis && (
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-500 dark:text-blue-400 flex justify-between items-center mb-2">
            <span> Imóveis cadastrados</span>
            <span className="text-2xl">🏡</span>
          </CardTitle>
          <CardDescription className="text-stone-500  dark:text-stone-300 text-xs ">
            Todos os seus imóveis cadastrados no momento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-3xl  sm:text-md  md:text-2xl   md:font-semibold text-stone-900 dark:text-white">
            {imoveis.length} cadastrados
          </span>
        </CardContent>
      </Card>
    )
  );
}

export default ImoveisCard;
