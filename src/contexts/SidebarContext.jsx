"use client";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

export const SideBarContext = createContext();

export function SideBarContextProvider({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);


  const values = { selectedItem };
  return (
    <SideBarContext.Provider value={values}>{children}</SideBarContext.Provider>
  );
}
