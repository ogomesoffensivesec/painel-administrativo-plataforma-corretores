import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth"
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyBNyNhuLUxuHskST_AHoQqQ-uIgX9ZrH-U",
  authDomain: "plataforma-corretores.firebaseapp.com",
  databaseURL: "https://plataforma-corretores-default-rtdb.firebaseio.com",
  projectId: "plataforma-corretores",
  storageBucket: "plataforma-corretores.appspot.com",
  messagingSenderId: "802491799746",
  appId: "1:802491799746:web:ecef37d5ef5d1e6af3835b",
  measurementId: "G-0NCP36F77B"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const database = getDatabase(app)
const storage = getStorage(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export { app, auth, provider, database, storage }