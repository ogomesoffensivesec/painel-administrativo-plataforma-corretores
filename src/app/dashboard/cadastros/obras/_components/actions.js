'use server'
import { database } from "@/database/config/firebase";
import { ref, set } from "firebase/database";

export async function createBuild(build) {
  try {
    const databaseReference = ref(database, `/obras/${build.id}`)
    await set(database, build)
    return null
  } catch (err) {
    return err
  }
}