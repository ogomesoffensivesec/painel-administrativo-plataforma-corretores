'use client'

import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  onIdTokenChanged,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { auth, database, provider, storage } from "../database/config/firebase";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cookie from 'js-cookie'
import { toast } from "@/components/ui/use-toast";
import { get, ref, set } from "firebase/database";

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

  const router = useRouter();

  const verifyUser = async () => {
    const referenciaDatabase = ref(database, `/corretores`)
    const snapshot = await get(referenciaDatabase)
    const users = snapshot.val()
    if (users === null) {
      return false
    }
    const userChecked = await Object.values(users).find((u) => u.uid === user.uid)

    const verified = userChecked !== undefined && userChecked.verify
    return verified
  }






  const handleUser = async (currentUser) => {
    if (currentUser) {
      const formatedUser = await formatUser(currentUser)
      setUser(formatedUser)
      setSession(true)

      return formatedUser
    }
    setUser(false)
    setSession(false)
    return false
  }


  const setSession = (session) => {
    if (session) {
      cookie.set('ogdev-auth', session, {
        expires: 1
      })
    } else {
      cookie.remove('ogdev-auth')
    }
  }

  const signInGoogle = async () => {
    try {
      setLoading(true);
      const response = await signInWithPopup(auth, provider)
      //const credential = GoogleAuthProvider.credentialFromResult(response);
      // const token = credential.accessToken;
      const user = response.user;
      const newUser = handleUser(user)

      router.push("/dashboard");
      return response;
    } finally {
      setLoading(false);
    }
  }

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

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const currentUser = userCredential.user;
      const newUser = await handleUser(currentUser)


      newUser.phone = userData.phone
      newUser.name = userData.name
      newUser.creciFile = userData.creciFile
      await writeUserToDatabase(newUser)

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Parabéns! Agora você faz parte do nosso time!',
        variant: 'success'
      })
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500)
      return newUser

    } finally {
      setLoading(false)
    }
  }


  const writeUserToDatabase = async (userData) => {
    const databaseRef = ref(database, `/corretores/${userData.uid}/`)
    try {
      await set(databaseRef, userData)
    } catch (error) {
      console.log(error.code);
    }
  }

  const signout = async () => {
    router.push('/')
    await signOut(auth)
    handleUser(false)
  }


  const changeUserData = async (name) => {
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      console.log('profile alterado');
      handleUser(auth.currentUser)
    }).catch((error) => {
      // An error occurred
      // ...
    });
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
    signInGoogle,
    signUp,
    signout,
    changeUserData,
    uploadFile,
    handleUser,
    setUser,
    writeUserToDatabase,
    verifyUser

  }}>{children}</AuthContext.Provider>
}

export const AuthConsumer = AuthContext.Consumer;
export default AuthContext;
