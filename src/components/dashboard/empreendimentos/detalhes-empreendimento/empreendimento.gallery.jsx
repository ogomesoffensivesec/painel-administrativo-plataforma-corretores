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

function Gallery({ modelos }) {
  const { counter, setCounter } = useData();
  const [images, setImages] = useState([]);

  useEffect(() => {
    console.log(modelos);
    if (modelos[counter].imagens) {
      setImages(modelos[counter].imagens);
    } else {
      setImages([]);
    }
  }, [counter]);

  return (
    <div className="w-full ">
      <Carousel>
        <div className="w-full my-3">
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
        </div>

        <CarouselContent>
          {images.length > 0 ? (
            images.map((image) => (
              <CarouselItem
                className="w-full min-h-[300px] select-none"
                key={image.id}
              >
                <Image
                  src={image.url}
                  alt="image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="rounded-md"
                  style={{ width: "100%", height: "auto" }} // optional
                />
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
