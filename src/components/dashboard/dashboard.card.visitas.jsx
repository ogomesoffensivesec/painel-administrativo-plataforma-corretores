"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React, { useEffect, useState } from "react";
import { getVisits } from "./visitas/visitas-data";
import { get, onValue, ref } from "firebase/database";
import { database } from "@/database/config/firebase";

// import { Container } from './styles';

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
      <Card className="lg:w-[300px]   bg-white dark:bg-stone-800 border-solid border-[1px] border-stone-400 dark:border-stone-500">
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

export default VisitasCard;
