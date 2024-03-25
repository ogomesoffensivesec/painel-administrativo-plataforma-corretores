'use client';

import { toast } from "@/components/ui/use-toast";
import { database, storage } from "@/database/config/firebase";
import { get, off, onValue, ref, remove, set, update } from "firebase/database";
import { deleteObject, getDownloadURL, listAll, ref as storageRef, uploadBytes } from 'firebase/storage';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { v4 } from "uuid";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [empreendimentos, setEmpreendimentos] = useState([]);
  const [empreendimento, setEmpreendimento] = useState({});
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const router = useRouter();

  function priceFilters(models) {
    let prices = [];
    if (empreendimento.id) {
      models.forEach(model => prices.push(model.price));
      prices.sort((a, b) => b - a);
    }
    return Math.max(...prices);
  }

  function encontrarItemPorId(id) {
    const referenciaEmpreendimento = ref(database, `/empreendimentos/${id}`);

    const buscarEmpreendimento = async () => {
      try {
        await onValue(referenciaEmpreendimento, (snapshot) => {
          const emp = snapshot.val();
          setEmpreendimento(emp);
        });
      } catch (error) {
        console.error(error);
      }
    };

    buscarEmpreendimento();

    return () => {
      off(referenciaEmpreendimento);
    };
  }


  async function create(empreendimento, modelos) {
    setLoading(true);
    const uid = v4();
    const referenciaDatabase = ref(database, `/empreendimentos/${uid}`);
    const modelosEnviados = await uploadFiles(modelos, uid);
    empreendimento.modelos = modelosEnviados;
    empreendimento.id = uid;
    try {
      await set(referenciaDatabase, empreendimento);
      toast({
        title: "Empreendimento cadastrado com sucesso!",
        description: "O empreendimento está pronto para ser publicado",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao cadastrar empreendimento!",
        description: "Revise os dados e tente novamente.",
        variant: "destructive",
      });
    }
    finally {
      setLoading(false);
    }
  }

  async function uploadFiles(modelos, empreendimentoId) {
    const uploadTasks = modelos.map(async (modelo) => {
      const imagensEnviadas = await uploadImages(modelo.imagens, empreendimentoId, modelo.id);
      const documentosEnviados = await uploadDocuments(modelo.documentos, empreendimentoId, modelo.id);
      const arquivoDocumentos = await uploadFile(modelo.fileDocument, empreendimentoId, modelo.id);
      const arquivoImagens = await uploadFile(modelo.fileImage, empreendimentoId, modelo.id);
      return { ...modelo, imagens: imagensEnviadas, documentos: documentosEnviados, arquivoDocumentos, arquivoImagens };
    });
    return await Promise.all(uploadTasks);
  }

  async function uploadImages(images, empreendimentoId, modeloId) {
    try {
      const uploadTasks = Object.values(images).reduce(async (accPromise, image) => {
        const acc = await accPromise;
        try {
          const imageId = v4();
          const referenciaImagem = storageRef(storage, `/empreendimentos/${empreendimentoId}/modelos/${modeloId}/imagens/${imageId}`);
          await uploadBytes(referenciaImagem, image, { contentType: image.type });
          const url = await getDownloadURL(referenciaImagem);
          acc[imageId] = { url, id: imageId };
          return acc;
        } catch (error) {
          throw new Error(`Erro ao processar imagem: ${error.message}`);
        }
      }, Promise.resolve({}));
      return await uploadTasks;
    } catch (error) {
      console.error(`Erro ao fazer upload de imagens: ${error.message}`);
      throw error;
    }
  }

  async function addNewImagesToModel(images, empreendimentoId, modeloId) {
    try {
      const uploadTasks = Object.values(images).reduce(async (accPromise, image) => {
        const acc = await accPromise;
        try {
          const imageId = v4();
          const referenciaImagem = storageRef(storage, `/empreendimentos/${empreendimentoId}/modelos/${modeloId}/imagens/${imageId}`);
          await uploadBytes(referenciaImagem, image, { contentType: image.type });
          const url = await getDownloadURL(referenciaImagem);
          acc[imageId] = { url, id: imageId };
          return acc;
        } catch (error) {

          throw new Error(`Erro ao processar imagem: ${error.message}`);
        }
      }, Promise.resolve({}));
      return await uploadTasks;
    } catch (error) {
      console.error(`Erro ao adicionar novas imagens ao modelo: ${error.message}`);
      throw error; 
    }
  }

  async function uploadDocuments(documents, empreendimentoId, modeloId) {
    const uploadTasks = Object.values(documents).map(async (document) => {
      const documentId = v4();
      const referenciaDocumento = storageRef(storage, `/empreendimentos/${empreendimentoId}/modelos/${modeloId}/documentos/${documentId}`);
      await uploadBytes(referenciaDocumento, document, { contentType: document.type });
      const url = await getDownloadURL(referenciaDocumento);
      return { url, id: documentId, name: document.nome };
    });
    return await Promise.all(uploadTasks);
  }

  async function uploadFile(file, empreendimentoId, modeloId) {
    const arquivoId = v4();
    const referenciaDocumento = storageRef(storage, `/empreendimentos/${empreendimentoId}/modelos/${modeloId}/documentos/${arquivoId}.zip`);
    await uploadBytes(referenciaDocumento, file, { contentType: file.type });
    const url = await getDownloadURL(referenciaDocumento);
    return { url, id: arquivoId };
  }

  function fetchInvestments(referencia) {
    return get(referencia);
  }

  async function getInvestiments(name, type, status) {
    const referenciaDatabase = ref(database, '/empreendimentos');
    let investments = [];

    const snapshot = await fetchInvestments(referenciaDatabase);
    if (!snapshot.exists()) {
      return investments
    }
    if (snapshot.exists()) {
      investments = Object.values(snapshot.val());

      if (name) {
        investments = investments.filter((investment) =>
          investment.nome.toLowerCase().includes(name.toLowerCase())
        );
      }

      if (type) {
        investments = investments.filter((investment) =>
          investment.type.includes(type)
        );
      }
    }
    return investments;
  }

  async function excluirEmpreendimento() {
    const idEmpreendimento = empreendimento.id;
    try {

      const referenciaDatabase = ref(database, `/empreendimentos/${idEmpreendimento}`);
      const referenciaStorage = storageRef(storage, `/empreendimentos/${idEmpreendimento}`);
      await remove(referenciaDatabase);

      await listAll(referenciaStorage).then(async (res) => {
        await Promise.all(res.items.map(async (itemRef) => {
          await deleteObject(itemRef);


        }));
      });

      const empreendimentosAtualizados = empreendimentos.filter(emp => emp.id !== idEmpreendimento);
      setEmpreendimentos(empreendimentosAtualizados);
      toast({
        title: 'Empreendimento excluído com sucesso!',
        variant: 'success'
      });
      setTimeout(() => {
        router.push('/dashboard/empreendimentos');
      }, 1000);
      return;
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao excluir empreendimento!',
        variant: 'destructive'
      });
    }
  }

  useEffect(() => {
    const referenciaDatabase = ref(database, '/empreendimentos');

    const buscarDados = async () => {
      try {
        await onValue(referenciaDatabase, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            setEmpreendimentos(Object.values(data));
          } else {
            setEmpreendimentos([]);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    buscarDados();
    return () => {
      off(referenciaDatabase);
    };
  }, []); 


  async function publicarEmpreendimento(emp) {
    const { empreendimento } = emp
    try {
      const referenciaPost = ref(database, `/publicados/${empreendimento.id}`)
      const referenciaUpdate = ref(database, `/empreendimentos/${empreendimento.id}`)

      await update(referenciaUpdate, { published: true })

      await set(referenciaPost, empreendimento)
      toast({
        title: 'Sucesso ao publicar imóvel!',
        description: 'Agora os corretores poderão visualizar as informações do empreendimento!',
        variant: 'success'
      })
      return
    } catch (error) {
      toast({
        title: 'Erro ao publicar empreendimento!',
        description: 'Tente novamente em alguns instantes',
        variant: 'destructive'
      })
    }
  }

  async function compartilharWhatsapp(phone) {


    const message = `A
    B
    C
    D
    E
    F
    G`
    const url = `https://wa.me/55${phone}?text=${message}`

    try {
      const newWindow = window.open(url, '_blank', 'noopener, noreferrer')
      if (newWindow) newWindow.opener = null

    } catch (error) {
      toast({
        title: '', description: '', variant: 'destructive'
      })
    }

  }
  return (
    <DataContext.Provider value={{
      create,
      empreendimentos,
      getInvestiments,
      encontrarItemPorId,
      empreendimento,
      setEmpreendimento,
      priceFilters,
      loading,
      excluirEmpreendimento,
      counter,
      setCounter,
      publicarEmpreendimento,
      compartilharWhatsapp,
      addNewImagesToModel
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const DataConsumer = DataContext.Consumer;
export default DataContext;
