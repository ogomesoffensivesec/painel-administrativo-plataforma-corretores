'use client';

import { database } from "@/database/config/firebase";
import { get, ref, update } from "firebase/database";
import { createContext, useEffect, useState } from "react";

const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [users, setUsers] = useState();
  const [user, setUser] = useState();




  const obterReferencia = (id) => {
    if (!id) {
      const referenciaUsuarios = ref(database, '/corretores')
      return referenciaUsuarios
    }
    if (id) {
      const referenciaUsuarios = ref(database, `/corretores/${id}`)
      return referenciaUsuarios

    }

  }
  let corretores = []

  async function fetchUsers(name) {
    const referenciaUsuarios = obterReferencia()
    const snapshot = await get(referenciaUsuarios)
    if (snapshot.exists()) {
      setUsers(snapshot.val())
      corretores = Object.values(snapshot.val())

      if (name) {
        corretores = corretores.filter(corretor => corretor.name.toLowerCase().includes(name.toLowerCase()))
      }
      return corretores
    }
  }


  async function updateVisita(visitaID, corretorID) {
    const referenciaUsuario = await obterReferencia(corretorID)
    const usuario = Object.values(users).find(userRaw => userRaw.uid === corretorID)
    let visitas = []
    if (usuario.visitas) {
      visitas = usuario.visitas
      visitas.push(visitaID)
    } else {
      visitas.push(visitaID)
    }

    await update(referenciaUsuario, {
      visitas: visitas
    })

  }
  const fetchUser = async (id) => {
    try {
      const referenciaUser = ref(database, `/corretores/${id}`);
      const snapshot = await get(referenciaUser);
      if (snapshot.exists()) {
        setUser(snapshot.val());
        console.log('Usuario encontrado: ', snapshot.val());
        return snapshot.val();
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      // Aqui você pode tratar o erro de acordo com sua lógica de aplicativo
      // Por exemplo, lançar uma exceção, retornar um valor padrão, etc.
    }
  };


  useEffect(() => {
    fetchUsers()
  }, []);

  return (
    <UsersContext.Provider value={{
      users,
      fetchUsers,
      updateVisita,
      fetchUser,
      user

    }}>
      {children}
    </UsersContext.Provider>
  );
}

export const UsersConsumer = UsersContext.Consumer;
export default UsersContext;
