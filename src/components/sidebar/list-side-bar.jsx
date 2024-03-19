"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useAuth from "@/hooks/useAuth";
import {
  ArrowLeftRight,
  CalendarCheck,
  FilePlus,
  Files,
  Handshake,
  HomeIcon,
  LogOut,
  Settings2,
  UserCheckIcon,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";

function ListSideBar({ userFake }) {
  const segment = useSelectedLayoutSegment();
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState("light");
  const [themeToggle, setThemeToggle] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const { signout } = useAuth();
  const { user } = useAuth();

  const changeTheme = () => {
    setThemeToggle(!themeToggle);
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    setIsClient(true);
    if (isClient) {
      const storedTheme = localStorage.getItem("theme");

      if (storedTheme) {
        setTheme(storedTheme);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("theme", theme);
    }

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setThemeToggle(false);
    } else {
      document.documentElement.classList.remove("dark");
      setThemeToggle(true);
    }
  }, [theme, isClient]);

  const menuItems = [
    {
      text: "Dashboard",
      icon: <HomeIcon className="w-6 h-6" />,
      selected: !segment ? true : false,
      href: "/dashboard",
    },

    {
      text: "Empreendimentos",
      icon: <ArrowLeftRight className="w-6 h-6" />,
      selected: segment === "empreendimentos" ? true : false,

      href: "/dashboard/empreendimentos",
    },

    // {
    //   text: "Meus Clientes",
    //   icon: <Users className="w-6 h-6" />,
    //   selected: segment === "meus-clientes" ? true : false,
    //   href: "/dashboard/meus-clientes",
    // },

    {
      text: "Visitas",
      icon: <CalendarCheck className="w-6 h-6" />,
      selected: segment === "visitas" ? true : false,
      href: "/dashboard/visitas",
    },
    // {
    //   text: "Negociações",
    //   icon: <Handshake className="w-6 h-6" />,
    //   selected: segment === "negociacoes" ? true : false,

    //   href: "/dashboard/negociacoes",
    // },

    // {
    //   text: "Configurações",
    //   icon: <Settings2 className="w-6 h-6" />,
    //   selected: segment === "settings" ? true : false,
    //   href: "/dashboard/settings",
    // },
  ];
  return (
    <>
      {isClient && user && (
        <>
          <div className=" w-full h-44 flex flex-col justify-center items-center border-b-[1px] border-solid border-zinc-300 dark:border-stone-700 transition-all duration-500">
            <Image
              src={user.photoUrl ? user.photoUrl : userFake.avatar}
              alt={user.name}
              width={96}
              height={96}
              className="rounded-full shadow object-contain"
            />
            <div className="flex gap-1 justify-center w-full mt-4 text-stone-900 dark:text-stone-300">
              <span>Olá, </span>
              <span>{user.name}</span>
            </div>
          </div>
          <ul className="w-full h-full flex flex-col items-center pt-8 flex-1">
            {menuItems &&
              menuItems.map((item) => (
                <li
                  key={item.text}
                  className="w-full h-7 flex justify-start items-center  p-6 gap-5"
                >
                  <Link
                    href={item.href}
                    className={`w-full h-7 flex justify-start items-center cursor-pointer   gap-5 transition-all duration-200 ease-in ${
                      item.selected
                        ? " text-blue-600   dark:text-blue-400 "
                        : " text-stone-500 font-nornal  dark:text-stone-300  "
                    }`}
                  >
                    {item.icon}
                    <span> {item.text}</span>
                  </Link>
                </li>
              ))}
          </ul>
          <ul className="w-full h-26 border-solid border-t-[1px] border-zinc-300 dark:border-stone-700 p-6 flex flex-col justify-left gap-5">
            <li className="w-full flex items-center space-x-4">
              <div className="h-8 w-8 flex justify-center items-center">
                <Switch
                  checked={themeToggle}
                  onCheckedChange={changeTheme}
                  id="theme-switcher"
                />
              </div>
              <div className="h-8 w-18 flex justify-center items-center ml-3">
                <Label
                  htmlFor="theme-switcher"
                  className="dark:text-white cursor-pointer"
                >
                  {theme === "dark" ? "Tema escuro" : "Tema claro"}
                </Label>
              </div>
            </li>

            <li
              className="w-full flex justify-left item-center space-x-4 cursor-pointer"
              onClick={signout}
            >
              <div className="h-8 w-8 flex justify-center items-center">
                <LogOut className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="h-8 w-8 flex justify-left items-center">
                <span className="text-blue-600 dark:text-blue-400">Sair</span>
              </div>
            </li>
          </ul>
        </>
      )}
    </>
  );
}

export default ListSideBar;
