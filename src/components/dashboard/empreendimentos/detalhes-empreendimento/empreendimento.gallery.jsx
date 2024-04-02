"use client";

import React, { Suspense, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import useData from "@/hooks/useData";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Delete, Grid, LayoutDashboard, Trash, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";

function Gallery({ modelos, setGrid, grid, setModelo, setImage }) {
  const { counter, setCounter } = useData();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (modelos[counter].imagens) {
      setImages(modelos[counter].imagens);
      setModelo(modelos[counter]);
    } else {
      setImages([]);
    }
  }, [counter]);

  return (
    <div className="w-full ">
      <Carousel>
        <div className="w-full my-3 space-y-3 flex flex-col items-center">
          <Select onValueChange={(value) => setCounter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Imagens do modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Modelos</SelectLabel>
                {modelos &&
                  modelos.map((modelo, index) => (
                    <SelectItem value={index} key={modelo.id}>
                      Modelo {index + 1}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {!grid ? (
            <Button
              size="sm"
              className=" w-full gap-3 "
              onClick={() => {
                setGrid(!grid);
                setImage(images);
              }}
            >
              <Grid size={12} color="white" />
              Grade de imagens
            </Button>
          ) : (
            <Button
              size="sm"
              className=" w-full gap-3 "
              onClick={() => {
                setGrid(!grid);
              }}
            >
              <Undo size={12} color="white" />
              Voltar
            </Button>
          )}
        </div>

        <CarouselContent>
          {Object.values(images).length > 0 ? (
            Object.values(images).map((image) => (
              <CarouselItem
                className="w-full min-h-[300px] select-none"
                key={image.id}
              >
                <AspectRatio>
                  <div>
                    <Image
                      src={image.url}
                      alt="image"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="rounded-md"
                      style={{
                        width: "100%",
                        height: "auto",
                        position: "absolute",
                      }}
                    />
                  </div>
                </AspectRatio>
              </CarouselItem>
            ))
          ) : (
            <div className="w-full text-center">
              <span>Nenhuma imagem</span>
            </div>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default Gallery;
