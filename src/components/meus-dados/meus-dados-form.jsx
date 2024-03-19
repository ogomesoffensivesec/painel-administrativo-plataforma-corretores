"use client";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeIcon, EyeOffIcon, File } from "lucide-react";

import { faker } from "@faker-js/faker";
import { toast } from "../ui/use-toast";
import { Progress } from "../ui/progress";

function MeusDadosForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [filePreview, setFilePreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [fileType, setFileType] = useState("");
  const [profileType, setProfileType] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [passwordView, setPasswordView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const fileType = file.type.split("/")[0];
      setFileType(fileType);
    }
  };
  const handleImageProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);

      const fileType = file.type.split("/")[0];
      setProfileType(fileType);
    }
  };

  const loadingProgress = async () => {
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await loadingProgress();
      setLoading(false);
      setProgress(0);
      toast({
        title: "Sucesso ao atualizar informações!",
        description: "As informações do seu perfil foram atualizadas!",
        variant: "success",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Erro ao atualizar informações!",
        description: "Revise as informações do seu perfil!",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const userProfile = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      tel: faker.phone.number(),
      creci: faker.finance.account(5),
      password: faker.internet.password(),
    };

    setValue("fullName", userProfile.fullName);
    setValue("email", userProfile.email);
    setValue("tel", userProfile.tel);
    setValue("creci", userProfile.creci);
    setValue("password", userProfile.password);
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex gap-4 items-start justify-center"
      >
        <div className="w-full flex flex-col gap-3">
          <span className="text-lg font-medium text-blue-600">
            Suas informações pessoais
          </span>
          <div className="w-full flex flex-col items-start">
            <Label htmlFor="fullName" className="text-xs mb-1 text-stone-500">
              Nome completo
            </Label>
            <Input
              className="w-full"
              name="fullName"
              {...register("fullName")}
            />
          </div>
          <div className="w-full flex flex-col items-start">
            <Label htmlFor="email" className="text-xs mb-1 text-stone-500">
              E-mail
            </Label>
            <Input className="w-full" name="email" {...register("email")} />
          </div>
          <div className="w-full flex flex-col items-start">
            <Label htmlFor="tel" className="text-xs mb-1 text-stone-500">
              Telefone
            </Label>
            <Input className="w-full" name="tel" {...register("tel")} />
          </div>
          <div className="w-full flex flex-col items-start">
            <Label htmlFor="creci" className="text-xs mb-1 text-stone-500">
              Documento CRECI
            </Label>
            <Input className="w-full" name="creci" {...register("creci")} />
          </div>
          <div className="w-full flex flex-col items-start">
            <Label htmlFor="document" className="text-xs mb-1 text-stone-500">
              Documento CRECI escaneado (somente imagens ou PDF)
            </Label>
            <div className="w-full h-auto flex gap-2 items-center">
              {fileType && (
                <div className="w-[100px]  flex justify-center items-center rounded-xl box-content ">
                  {fileType === "image" && filePreview && (
                    <img
                      src={filePreview}
                      alt="Preview do documento"
                      className="mt-2 w-full  rounded-md border-[2px] border-blue-600"
                    />
                  )}
                  {fileType === "application" && (
                    <File size={36} className="text-red-500" />
                  )}
                </div>
              )}
              <Input
                id="document"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.pdf"
                {...register("document")}
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="w-full flex flex-col items-start">
            <Label htmlFor="document" className="text-xs mb-1 text-stone-500">
              Foto do perfil
            </Label>
            <div className="w-full h-auto flex gap-2 items-center">
              {profileType && (
                <div className="w-[100px]  flex justify-center items-center rounded-xl box-content ">
                  {profileType === "image" && profileImage && (
                    <img
                      src={profileImage}
                      alt="Preview da imagem"
                      className="mt-2 w-full  rounded-md border-[2px] border-blue-600"
                    />
                  )}
                </div>
              )}
              <Input
                id="profileImage"
                type="file"
                accept=".jpg,.jpeg,.png"
                {...register("profileImage")}
                onChange={handleImageProfileChange}
              />
            </div>
          </div>
          <div className="w-full flex flex-col items-start">
            <Label htmlFor="document" className="text-xs mb-1 text-stone-500">
              Senha
            </Label>
            <div className="w-full h-auto flex gap-2 items-center">
              <div className=" flex justify-center items-center rounded-xl box-content ">
                {passwordView ? (
                  <EyeIcon
                    size={24}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setPasswordView(!passwordView)}
                  />
                ) : (
                  <EyeOffIcon
                    size={24}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setPasswordView(!passwordView)}
                  />
                )}
              </div>
              <Input
                id="password"
                type={passwordView ? "text" : "password"}
                {...register("password")}
              />
            </div>
            <div className="w-full h-auto flex gap-2 items-center mt-10 justify-end">
              <Button className="w-[220px]">
                {loading ? (
                  <Progress className="w-full  text-xs" value={progress} />
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    )
  );
}

export default MeusDadosForm;
