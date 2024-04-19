import { toast } from "@/components/ui/use-toast";
import { database } from "@/database/config/firebase";
import { sendMessage } from "@/services/whatsapp.bot";
import { get, ref, remove, set, update } from "firebase/database";

async function fetchImoveis() {
  const referenciaDatabase = ref(database, "/imoveis");
  const snapshot = await get(referenciaDatabase);
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
}

export async function getImoveis() {
  let imoveis = await fetchImoveis();
  return imoveis;
}
