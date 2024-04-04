"use client";
import Gallery from "@/components/dashboard/empreendimentos/detalhes-empreendimento/empreendimento.gallery";
import Infos from "@/components/dashboard/empreendimentos/detalhes-empreendimento/empreendimento.infos";
import PriceCard from "@/components/dashboard/empreendimentos/detalhes-empreendimento/empreendimento.price";
import TabsOptions from "@/components/dashboard/empreendimentos/detalhes-empreendimento/empreendimento.tabs";
import { Button } from "@/components/ui/button";
import {
  Download,
  Expand,
  Eye,
  EyeIcon,
  Pencil,
  Trash,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { storage } from "@/database/config/firebase";
import { toast } from "@/components/ui/use-toast";
import useData from "@/hooks/useData";
import { useRouter } from "next/navigation";

import useAuth from "@/hooks/useAuth";
import MenuEmpreendimento from "@/components/dashboard/empreendimentos/detalhes-empreendimento/empreendimento.menubar";
import VerificarChaves from "@/components/dashboard/empreendimentos/detalhes-empreendimento/empreendimento.verify.keys";
import { UsersProvider } from "@/contexts/user.context";
import GridGaleria from "@/components/dashboard/empreendimentos/detalhes-empreendimento/empreendimento.grid.galeria";
import { QueryClient, QueryClientProvider, useQueryClient } from "react-query";
function Page({ params }) {
  const id = params.empreendimentoId;
  const { user } = useAuth();

  const [grid, setGrid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState();
  const { empreendimento, priceFilters, counter } = useData();
  const [open, setOpen] = useState(false);
  const [modelo, setModelo] = useState();
  const [images, setImages] = useState();
  const route = useRouter();
  useEffect(() => {
    if (Object.keys(empreendimento).length === 0) {
      route.push("/dashboard/empreendimentos");
    } else {
      const max = priceFilters(empreendimento.modelos);
      if (!empreendimento.chaves) {
        setOpen(true);
      }

      setPrice(max);
    }
  }, []);

  useEffect(() => {
    setImages(
      empreendimento &&
        empreendimento.modelos &&
        empreendimento.modelos[counter].imagens &&
        empreendimento.modelos[counter].imagens
    );
  }, [empreendimento]);

  const downloadAllFilesFromFolder = async () => {
    const modelo = empreendimento.modelos[counter];
    try {
      setLoading(true);
      const link = document.createElement("a");
      link.href = modelo.arquivoImagens.url;
      link.download = "images.zip";
      link.click();
      toast({
        title: "Sucesso ao baixar imagens!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar imagens!",
        description: "Tente novamente em alguns instantes!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadButtonClick = () => {
    downloadAllFilesFromFolder();
  };

  return empreendimento && Object.keys(empreendimento).length > 0 ? (
    <UsersProvider>
      <div className="w-full h-screen p-10 flex  flex-col  items-center">
        <MenuEmpreendimento user={user} empreendimento={empreendimento} />
        <VerificarChaves open={open} id={id} setOpen={setOpen} />
        <div className="w-full flex justify-center items-center gap-6">
          <div className="w-1/3 h-full flex flex-col  ">
            <div className="mx-3">
              <Gallery
                modelos={empreendimento.modelos}
                setGrid={setGrid}
                grid={grid}
                setModelo={setModelo}
                setImage={setImages}
              />
              <div className="w-full flex justify-center items-center mt-3 gap-2">
                <Button
                  size="sm"
                  className=" w-1/2 flex justify-center items-center gap-2 "
                >
                  Câmera ao vivo
                  <Eye size={13} />
                </Button>
                {/* <Button
              size="sm"
              className=" w-1/2 flex justify-center items-center gap-2 "
            >
              Expadir
              <Expand size={13} />
            </Button> */}
                <Button
                  size="sm"
                  disabled={loading}
                  className=" w-1/2 flex justify-center items-center gap-2 "
                  onClick={handleDownloadButtonClick}
                >
                  {loading && "Baixando..."}
                  {!loading && `Baixar imagens`}
                  <Download size={13} />
                </Button>
              </div>
            </div>
            <Infos empreendimento={empreendimento} />
          </div>
          <div className="w-2/3 h-full flex flex-col gap-4 px-8 ">
            {!grid && (
              <>
                <div className="flex gap-6">
                  <PriceCard price={price && price} />
                </div>
                <div className="mt-4">
                  <TabsOptions empreendimento={empreendimento} />
                </div>
              </>
            )}

            {grid && (
              <GridGaleria
                images={images}
                idEmpreendimento={id}
                modelo={modelo}
              />
            )}
          </div>
        </div>
      </div>
    </UsersProvider>
  ) : (
    <span>Carregando...</span>
  );
}

export default Page;
