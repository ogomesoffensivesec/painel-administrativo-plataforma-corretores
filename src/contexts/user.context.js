'use client';

import { database } from "@/database/config/firebase";
import { get, ref } from "firebase/database";
import { createContext, useEffect, useState } from "react";

const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [users, setUsers] = useState();

  useEffect(() => {
    async function fetchUsers() {
      const referenciaUsuarios = ref(database, '/corretores')
      const snapshot = await get(referenciaUsuarios)
      if (snapshot.exists()) {
        setUsers(snapshot.val())

      }
    }
    fetchUsers()
  }, []);

  return (
    <UsersContext.Provider value={{
      users
    }}>
      {children}
    </UsersContext.Provider>
  );
}

export const UsersConsumer = UsersContext.Consumer;
export default UsersContext;
