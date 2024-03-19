"use client";

import { auth } from "@/database/config/firebase";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// import { Container } from './styles';

function Settings() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (user === null) {
      router.push("/");
    }
  }, [user, router]);
  return (
    <div className="flex-1 w-full h-full px-20 py-10 space-y-8 bg-stone-950 ">
      TESTE
    </div>
  );
}

export default Settings;
