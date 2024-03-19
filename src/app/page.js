'use client'
import React, { useEffect, useState } from "react";
import HeaderImage from "../assets/header.png";
import Logo from "../assets/logo-cortada.png";
import { Instagram, Mail, } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LoginDialog from "@/components/auth/login.dialog";
import RegisterDialog from "@/components/auth/register.dialog";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/database/config/firebase";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import WhatsappIcon from '../assets/whatsapp.png'

function Home() {
  const [user] = useAuthState(auth);
  const { signInGoogle } = useAuth()
  const router = useRouter();
  const [email, setEmail] = useState('');

  // if (user) {
  //   router.push('/dashboard')
  // }
  const sendEmail = () => {
    const email = "gomes.rootkit@gmail.com";
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="h-screen w-screen bg-stone-100">
      <div className="w-full h-[85px] flex px-10 items-center justify-between">
        <div className="w-[70px]">
          <Image src={Logo} alt="Make Home" className="w-full" />
        </div>
        <div className="w-1/2 flex justify-end gap-9 items-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-md font-semibold text-stone-700 hover:text-blue-500 transition-all duration-300"
          >
            Sobre a plataforma
          </button>
          {/**
         * 
         *     <Link
            to="/"
            className="text-md font-semibold text-stone-700 hover:text-blue-500 transition-all duration-300"
          >
            Perguntas frequentes
          </Link>
         */}
          {
            !user ? <LoginDialog /> : <Button onClick={() => router.push('/dashboard')}>Acessar plataforma</Button>
          }
        </div>
      </div>
      <div className="w-full h-[750px] flex  mt-2">
        <div className="w-1/2 flex  h-[750px] flex-col py-20 px-[100px] gap-1 ">
          <span className="text-3xl text-left mt-10">
            Conheça a plataforma de corretores
          </span>
          <span className="text-5xl text-left font-bold text-blue-500">
            Make Home
          </span>
          <div className="w-3/4 mt-3">
            <span className="text-lg">
              Fique por dentro das atualizações em tempo real dos
              empreendimentos imobiliário da nossa construtora.
            </span>
          </div>
          <form className="mt-8 flex flex-col gap-1">
            <label className="font-semibold text-stone-700 ">
              Acesse agora mesmo!
            </label>
            <div className="flex gap-2">

              <input
                className="w-3/4  border-[1px] border-blue-800 p-2 rounded shadow outline-none focus:ouline-none"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Digite seu e-mail aqui"
              />
              {email && <RegisterDialog email={email} />}
            </div>
            <Button

              type="button"
              variant="outline"
              className="text-sm text-right text-blue-500 border-blue-500 cursor-pointer flex justify-center w-3/4 gap-2 items-center mt-2 "
              onClick={signInGoogle}
            >
              Cadastrar com Google
            </Button>
            <div className="flex flex-col mt-32  space-y-3">
              <span className="text-lg font-bold text-blue-800">
                Fale com a nossa equipe!
              </span>
              <div className="w-full h-32 flex item-center space-x-6">
                <Link href={'https://wa.me/5511989846097?text=Teste'}
                  target="__blank">
                  <Image src={WhatsappIcon} alt='whatsapp' className="w-8 h-8 cursor-pointer " /></Link>

                <Link
                  href={"https://www.instagram.com/makehome.construtora/"}
                  target="__blank"
                  className="flex gap-1 items-center h-8"
                >
                  <Instagram

                    className="text-[#E1306C] cursor-pointer hover:text-stone-400 transition-all duration-500 w-8 h-8
                    "
                  />
                  <span className="ml-2 hover:text-stone-500 transition-all duration-500">Siga-nos </span>
                  <span className="text-blue-500 font-semibold hover:text-stone-500 transition-all duration-500"  >@makehome.construtora</span>
                </Link>

              </div>
            </div>
          </form>
        </div>
        <div className="w-1/2 flex items-center h-[750px] justify-center ">
          <Image src={HeaderImage} alt="header" className="w-[600px]" />
        </div>
      </div>
    </div>
  );
}

export default Home;
