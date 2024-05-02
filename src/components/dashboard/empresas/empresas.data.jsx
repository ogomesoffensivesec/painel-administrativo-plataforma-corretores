import { database } from "@/database/config/firebase";
import { get, ref } from "firebase/database";

async function fetchEmpresas() {
  const referenciaDatabase = ref(database, "/empresas");
  const snapshot = await get(referenciaDatabase);
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
}

export async function getEmpresas() {
  let empresas = await fetchEmpresas();
  return empresas;
}
