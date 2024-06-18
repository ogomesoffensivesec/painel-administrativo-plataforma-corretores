import { toast } from "@/components/ui/use-toast";
import { database, storage } from "@/database/config/firebase";
import { ref, set } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { v4 } from "uuid";
import JSZip from 'jszip';

export async function upsertCertificate(data) {
  try {
    const referenciaDatabase = ref(database, `/certificados/${data.id}`);
    const files = data.file;
    const uploadTasks = [];

    for (const file of files) {
      file.id = v4();
      const zip = new JSZip();
      const zipFile = zip.file(file.name, file);
      const zipBlob = await zip.generateAsync({ type: "blob" });

      const refs = storageRef(storage, `certificados/${data.id}/${file.id}.zip`);
      const uploadTask = uploadBytes(refs, zipBlob, { contentType: 'application/zip' }).then(async () => {
        const url = await getDownloadURL(refs);
        return { url, id: data.id, name: file.name, contentType: 'application/zip' };
      });
      uploadTasks.push(uploadTask);
    }

    Promise.all(uploadTasks).then((urls) => {
      data.file = urls;
      set(referenciaDatabase, data).then(() => {
        toast({
          title: 'Certificado atualizado com sucesso!',
          variant: 'success'
        });
      });
    });
  } catch (error) {
    console.error(error);
    toast({
      title: 'Erro',
      description: 'Ocorreu um erro ao atualizar o certificado.',
      variant: 'destructive'
    });
  }
}
