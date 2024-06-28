"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "@/database/config/firebase";


function VisitasCard() {
  const [visits, setVisits] = useState([]);
  useEffect(() => {
    const visitsRef = ref(database, "/visitas");
    const unsubscribe = onValue(visitsRef, (snapshot) => {
      if (snapshot.exists()) {
        let visitsArray = Object.values(snapshot.val());
        visitsArray = visitsArray.filter((visit) => !visit.finalizada);
        setVisits(visitsArray);
      } else {
        setVisits([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    visits && (
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-500 dark:text-blue-400 flex justify-between items-center">
            <span> Visitas agendadas</span>
            <span className="text-2xl">📅</span>
          </CardTitle>
          <CardDescription className="text-stone-500  dark:text-stone-300 text-xs ">
            Todas as suas visitas agendadas no momento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-3xl  sm:text-md  md:text-2xl   md:font-semibold text-stone-900 dark:text-white">
            {visits.length} agendadas
          </span>
        </CardContent>
      </Card>
    )
  );
}

export default VisitasCard;
