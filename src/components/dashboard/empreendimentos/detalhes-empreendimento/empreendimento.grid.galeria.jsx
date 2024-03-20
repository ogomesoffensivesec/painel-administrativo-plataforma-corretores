"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { database, storage } from "@/database/config/firebase";
import useData from "@/hooks/useData";
import { ref, remove } from "firebase/database";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { toast } from "@/components/ui/use-toast";
import AdicionarImagens from "./empreendimento.adicionar.imagens";

function GridGaleria({ images, modelo, idEmpreendimento }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const { counter, setCounter } = useData();
  const toggleImageSelection = (imageID) => {
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(imageID)) {
        return prevSelectedImages.filter(
          (selectedImage) => selectedImage !== imageID
        );
      } else {
        return [...prevSelectedImages, imageID];
      }
    });
  };

  const deleteSelectedImages = async () => {
    try {
      await Promise.all(
        selectedImages.map(async (selectedImageID) => {
          const referenciaDatabase = ref(
            database,
            `/empreendimentos/${idEmpreendimento}/modelos/${counter}/imagens/${selectedImageID}`
          );
          await remove(referenciaDatabase);

          const refenciaStorage = storageRef(
            storage,
            `/empreendimentos/${idEmpreendimento}/modelos/${modelo.id}/imagens/${selectedImageID}`
          );
          await deleteObject(refenciaStorage);
        })
      );

      toast({
        title: "Imagens excluídas com sucesso!",
        variant: "success",
      });
    } catch (error) {
      console.error(error.message);
      toast({
        title: "Erro ao excluir imagens!",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setSelectedImages([]);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-end mb-3 gap-4">
        <AdicionarImagens
          empreendimentoId={idEmpreendimento}
          modeloId={modelo.id}
          modelo={modelo}
        />
        <Button
          className="gap-3 font-semibold"
          variant="destructive"
          size="sm"
          onClick={deleteSelectedImages}
        >
          Apagar Imagens Selecionadas
          <Trash size={16} />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images &&
          Object.values(images).map((image) => (
            <AspectRatio key={image.id}>
              <div>
                <label htmlFor={image.id}>
                  <Image
                    width={256}
                    height={256}
                    src={image.url}
                    alt="Imagem"
                    className="absolute"
                  />
                  <Input
                    type="checkbox"
                    id={image.id}
                    checked={selectedImages.includes(image.id)}
                    onChange={() => toggleImageSelection(image.id)}
                    className="absolute w-4 right-1 top-1 border-blue-500 border-2"
                  />
                </label>
              </div>
            </AspectRatio>
          ))}
      </div>
    </div>
  );
}

export default GridGaleria;
