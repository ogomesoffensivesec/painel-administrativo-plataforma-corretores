'use client';

import { toast } from "@/components/ui/use-toast";
import { auth, database, storage } from "@/database/config/firebase";
import { get, off, onValue, ref, remove, set, update } from "firebase/database";
import { deleteObject, getDownloadURL, listAll, ref as storageRef, uploadBytes } from 'firebase/storage';
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { v4 } from "uuid";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [empreendimentos, setEmpreendimentos] = useState([]);
  const [empreendimento, setEmpreendimento] = useState({});
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [visitasPendentes, setVisitasPendentes] = useState([]);
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

  const deletarDocumento = async (imovelId, docId,) => {
    const referenciaDatabase = ref(database, `/imoveis/${imovelId}/documentos/`)
    const referenciaDocumento = storageRef(storage, `/imoveis/${imovelId}/documentos/${docId}`);
    const snapshot = await get(referenciaDatabase)
    if (snapshot.exists()) {
      const documentos = snapshot.val()
      const documentosFiltrados = documentos.filter(doc => doc.id !== docId)
      set(referenciaDatabase, documentosFiltrados).then(async () => {
        await deleteObject(referenciaDocumento).then(() => {
          toast({
            title: 'Documento removido com sucesso!',
            variant: 'success'
          })
        })
      })
    }



  }
  const uploadDocumentosImovel = async (documents, imovelID) => {
    const uploadTasks = [];
    for (const documentKey in documents) {
      const documentList = documents[documentKey];
      for (const document of documentList) {
        const documentId = v4();
        const referenciaDocumento = storageRef(storage, `/imoveis/${imovelID}/documentos/${documentId}`);
        var data = new Date();
        var dia = String(data.getDate()).padStart(2, '0');
        var mes = String(data.getMonth() + 1).padStart(2, '0');
        var ano = data.getFullYear();
        const usuarioAtual = auth.currentUser.displayName


        var dataAtual = dia + '/' + mes + '/' + ano;

        const uploadTask = uploadBytes(referenciaDocumento, document, { contentType: document.type })
          .then(async () => {
            const url = await getDownloadURL(referenciaDocumento);

            return { url, id: documentId, name: document.name, tipo: documentKey, createdAt: dataAtual, createdBy: usuarioAtual };
          });
        uploadTasks.push(uploadTask);
      }
    }

    // Aguardar todas as tarefas de upload concluírem antes de retornar
    return await Promise.all(uploadTasks);
  }


  async function enviarNovosDocumentos(documents, imovelID) {
    const uploadTasks = [];
    for (const documentKey in documents) {
      const documentList = documents[documentKey];
      for (const document of documentList) {
        const documentId = v4();
        const referenciaDocumento = storageRef(storage, `/imoveis/${imovelID}/documentos/${documentId}`);
        var data = new Date();
        var dia = String(data.getDate()).padStart(2, '0');
        var mes = String(data.getMonth() + 1).padStart(2, '0');
        var ano = data.getFullYear();

        const usuarioAtual = auth.currentUser.displayName


        var dataAtual = dia + '/' + mes + '/' + ano;

        const uploadTask = uploadBytes(referenciaDocumento, document, { contentType: document.type })
          .then(async () => {
            const url = await getDownloadURL(referenciaDocumento);

            return { url, id: documentId, name: document.name, tipo: documentKey, createdAt: dataAtual, createdBy: usuarioAtual };
          });

        uploadTasks.push(uploadTask);
      }
    }

    return await Promise.all(uploadTasks);
  }


  async function cadastrarNovosDocumentos(imovel, newDocs) {
    const imovelID = imovel.id
    try {
      setLoading(true)
      const documentosEnviados = await enviarNovosDocumentos(newDocs, imovelID);

      let novosDocumentos = imovel.documentos || []
      const arrayDocumentos = novosDocumentos.concat(documentosEnviados)


      const referenciaImovel = ref(database, `/imoveis/${imovelID}/documentos`);
      await set(referenciaImovel, arrayDocumentos);

      toast({
        title: 'Novos documentos inseridos com sucesso',
        variant: 'success'
      });
      return documentosEnviados

    } catch (error) {
      console.log(error);
      toast({
        title: 'Erro ao inserir novos documentos!',
        variant: 'destructive'
      });
    }
    finally {
      setLoading(false)
    }
  }


  async function createImovel(imovel) {
    try {
      setLoading(true)
      const imovelID = imovel.id
      const documentosEnviados = await uploadDocumentosImovel(imovel.documentos, imovelID);
      imovel.documentos = documentosEnviados;

      const referenciaImovel = ref(database, `/imoveis/${imovelID}`);
      await set(referenciaImovel, imovel);

      toast({
        title: 'Imóvel cadastrado com sucesso',
        description: 'Parabéns! Você acaba de cadastrar um novo imóvel!',
        variant: 'success'
      });

    } catch (error) {
      console.log(error);
      toast({
        title: 'Erro ao cadastrar o imóvel!',
        variant: 'destructive'
      });
    }
    finally {
      setLoading(false)
    }
  }




  async function create(empreendimento, modelos) {

    setLoading(true);
    const uid = v4();
    const referenciaDatabase = ref(database, `/empreendimentos/${uid}`);
    const modelosEnviados = await uploadFiles(modelos, uid)
    empreendimento.modelos = modelosEnviados;
    empreendimento.id = uid;
    try {
      await set(referenciaDatabase, empreendimento)
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
      router.push('/dashboard/empreendimentos');
      setEmpreendimento({})
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
    const referenciaEmpreendimentos = ref(database, '/empreendimentos');
    const referenciaVisitasPendentes = ref(database, `/visitas-em-andamento`)
    const buscarDados = async () => {
      try {
        await onValue(referenciaVisitasPendentes, snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val()
            if (data !== null) {
              setVisitasPendentes(data)
            }
            else {
              setVisitasPendentes([])
            }
          }
        })
        await onValue(referenciaEmpreendimentos, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            setEmpreendimentos(Object.values(data));
            getInvestiments()
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
      off(referenciaEmpreendimentos);
      off(referenciaVisitasPendentes)
    };
  }, []);




  async function publicarEmpreendimento(emp) {
    try {
      const referenciaPost = ref(database, `/publicados/${emp.id}`)
      const referenciaUpdate = ref(database, `/empreendimentos/${emp.id}`)

      await update(referenciaUpdate, { published: true })

      await set(referenciaPost, emp)
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

  async function desfazerPublicacao(id) {
    try {
      const referenciaPublicacao = ref(database, `/publicados/${id}`)
      const referenciaEmpreendimento = ref(database, `/empreendimentos/${id}`)
      await update(referenciaEmpreendimento, {
        published: false
      })
      await remove(referenciaPublicacao)
      toast({
        title: 'Publicação removida',
        description: 'O empreendimento foi removido na plataforma de correotores!',
        variant: 'success'
      })
    } catch (error) {
      toast({
        title: 'Erro ao remover publicação',
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


  async function novoModelo(modelo) {

    try {
      const empreendimentoId = empreendimento.id
      // documents, empreendimentoId, modeloId
      // file, empreendimentoId, modeloId
      const referenciaModelos = ref(database, `/empreendimentos/${empreendimentoId}/modelos`);

      const snapshot = await get(referenciaModelos);
      const modelosAtuais = snapshot.val() || [];

      const imagensEnviadas = await uploadImages(modelo.imagens, empreendimentoId, modelo.id);
      const documentosEnviados = await uploadDocuments(modelo.documentos, empreendimentoId, modelo.id);
      const arquivoDocumentos = await uploadFile(modelo.fileDocument, empreendimentoId, modelo.id);
      const arquivoImagens = await uploadFile(modelo.fileImage, empreendimentoId, modelo.id);

      modelo.documentos = documentosEnviados
      modelo.imagens = imagensEnviadas
      modelo.arquivoDocumentos = arquivoDocumentos
      modelo.arquivoImagens = arquivoImagens

      modelosAtuais.push(modelo)
      await set(referenciaModelos, modelosAtuais)

      toast({
        title: 'Novo modelo adicionado!',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Erro ao adicionar novo modelo!',
        description: 'Houve um erro ao adicionar um novo modelo. Tente mais tarde!',
        variant: 'destructive'
      });
      console.error('Erro ao adicionar novo modelo:', error);
    }
  }


  async function apagarModelo(modeloID) {
    const empreendimentoID = empreendimento.id
    const referenciaModelos = ref(database, `/empreendimentos/${empreendimentoID}/modelos`)
    const snapshot = await get(referenciaModelos)


    try {
      if (snapshot.exists()) {
        let modelosAtuais = snapshot.val()
        modelosAtuais = modelosAtuais.filter(modeloFiltrado => modeloFiltrado.id !== modeloID)
        await set(referenciaModelos, modelosAtuais)
        toast({
          title: 'Modelo excluído com sucesso!',
          variant: 'success'
        })
      }
    } catch (error) {

      console.error(error.message)
      toast({
        title: 'Erro ao excluir modelo!',
        description: 'Houve um erro ao excluir um modelo. Tente novamente!',
        variant: 'destructive'
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
      addNewImagesToModel,
      visitasPendentes,
      novoModelo, apagarModelo,
      desfazerPublicacao,
      createImovel,
      cadastrarNovosDocumentos,
      deletarDocumento
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const DataConsumer = DataContext.Consumer;
export default DataContext;
