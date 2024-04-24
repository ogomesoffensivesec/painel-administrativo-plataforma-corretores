'use client'

import {
  signOut,
  signInWithEmailAndPassword, onIdTokenChanged, updateProfile
} from "firebase/auth";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { auth, database, storage } from "../database/config/firebase";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cookie from 'js-cookie';
import { toast } from "@/components/ui/use-toast";
import { get, ref, set } from "firebase/database";
import { v4 } from "uuid";

const AuthContext = createContext();

const formatUser = async (user) => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
  provider: user.providerData[0].providerId,
  photoUrl: user.photoURL,
  verify: true

}

)


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialogVerifyUser, setOpenDialogVerifyUser] = useState(false);

  const router = useRouter();

  const verifyUser = async () => {
    try {
      const referenciaDatabase = ref(database, `/corretores`)
      const snapshot = await get(referenciaDatabase)
      const users = snapshot.val()
      if (users === null) {
        return false
      }
      const userChecked = await Object.values(users).find((u) => u.uid === user.uid)

      const verified = userChecked !== undefined && userChecked.verify
      return verified
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao verificar o usuário.',
        variant: 'error'
      });
    }
  };





  const handleUser = async (currentUser) => {
    try {
      if (currentUser) {
        const formatedUser = await formatUser(currentUser)
        setUser(formatedUser)
        setSession(true)
        return formatedUser
      }
      setUser(false)
      setSession(false)
      return false
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar o usuário.',
        variant: 'error'
      });
    }
  };

  const setSession = (session) => {
    try {
      if (session) {
        cookie.set('ogdev-auth', session, {
          expires: 1
        })
      } else {
        cookie.remove('ogdev-auth')
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao configurar a sessão.',
        variant: 'error'
      });
    }
  };


  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      handleUser(userCredential.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
      toast({
        title: 'Email/Senha incorretos',
        description: 'Revise os dados e tente novamente!',
        variant: 'destructive'
      })
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  const writeUserToDatabase = async (userData) => {
    const databaseRef = ref(database, `/corretores/${userData.uid}/`);
    try {
      if (userData.creciFile && userData.creciFile.url) {
        await set(databaseRef, userData);
      } else {
        console.error("CreciFile URL is undefined.");
        toast({
          title: 'Erro',
          description: 'A URL do arquivo Creci não está definida.',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao escrever no banco de dados.',
        variant: 'error'
      });
    }
  };


  const signUp = async (email, pass, userData) => {


    try {
      setLoading(true);

      const newUser = {
        email: email,
        name: userData.name,
        phone: userData.phone,
        password: pass,
        uid: v4(),
        verify: true
      }


      const fileID = v4();
      const fileURL = await uploadFile(newUser.uid, userData.creciFile, fileID);
      const fileData = {
        url: fileURL,
        id: fileID
      };
      newUser.creciFile = fileData;

      await writeUserToDatabase(newUser);

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Parabéns! Agora o corretor faz parte do nosso time!',
        variant: 'success'
      });

      return newUser;
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao criar a conta do usuário.',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };





  const signout = async () => {
    router.push('/')
    await signOut(auth)
    handleUser(false)
  }


  const changeUserData = async (name) => {
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      handleUser(auth.currentUser)
    })
  }


  const uploadFile = async (userId, file, fileId) => {
    try {
      const fileReference = storageRef(
        storage,
        `/corretores/${userId}/${fileId}`
      );

      await uploadBytes(fileReference, file, {
        contentType: file.type,
      });

      const fileUrl = await getDownloadURL(fileReference);
      return fileUrl;
    } catch (error) {
      console.log(error.message);

    }
  };



  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, handleUser)

    return () => unsubscribe()
  }, [])
  return <AuthContext.Provider value={{
    user,
    loading,
    setLoading,
    signIn,
    signUp,
    signout,
    changeUserData,
    uploadFile,
    handleUser,
    setUser,
    writeUserToDatabase,
    verifyUser,
    openDialogVerifyUser,
    setOpenDialogVerifyUser

  }}>{children}</AuthContext.Provider>
}

export const AuthConsumer = AuthContext.Consumer;
export default AuthContext;
