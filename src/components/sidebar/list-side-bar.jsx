"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useAuth from "@/hooks/useAuth";
import {
  ArrowLeftRight,
  Bell,
  BetweenHorizonalEnd,
  Building2,
  CalendarCheck,
  Currency,
  CurrencyIcon,
  DollarSignIcon,
  FileIcon,
  Files,
  FolderArchive,
  HomeIcon,
  LogOut,
  Pencil,
  PlusCircle,
  PlusIcon,
  Sheet,
  ShieldCheckIcon,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";

function ListSideBar({ userFake }) {
  const segment = useSelectedLayoutSegment();
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState("light");
  const [themeToggle, setThemeToggle] = useState(false);

  const { signout } = useAuth();
  const { user, setOpenDialogVerifyUser } = useAuth();

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
      text: "Cadastros",
      icon: <PlusCircle className="w-6 h-6" />,
      selected: segment === "cadastros" ? true : false,
      href: "/dashboard/cadastros",
    },
    {
      text: "Compras",
      icon: <ShoppingCart className="w-6 h-6" />,
      selected: segment === "compras" ? true : false,
      href: "/dashboard/compras",
    },
    {
      text: "Financeiro",
      icon: <DollarSignIcon className="w-6 h-6" />,
      selected: segment === "financeiro" ? true : false,
      href: "/dashboard/financeiro",
    },
    {
      text: "Contabilidade",
      icon: <Sheet className="w-6 h-6" />,
      selected: segment === "contabilidade" ? true : false,
      href: "/dashboard/contabilidade",
    },
    {
      text: "Comercial",
      icon: <FolderArchive className="w-6 h-6" />,
      selected: segment === "comercial" ? true : false,
      href: "/dashboard/comercial",
    },
    {
      text: "Drive",
      icon: <Files className="w-6 h-6" />,
      selected: segment === "drive" ? true : false,
      href: "/dashboard/drive",
    },
    {
      text: "Garantias",
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      selected: segment === "garantias" ? true : false,
      href: "/dashboard/garantias",
    },
   
  
  ];
  return (
    <>
      {isClient && user && (
        <>
          <div className=" w-full h-44 flex flex-col justify-center items-center border-b-[1px] border-solid border-zinc-300 dark:border-stone-700 transition-all duration-500">
            <Image
              src={user.photoUrl ? user.photoUrl : userFake.avatar}
              width={96}
              alt="user"
              height={96}
              className="rounded-full shadow object-contain"
            />
            <div className="flex gap-3 justify-center items-center w-full mt-4 text-stone-900 dark:text-stone-300">
              <span>Olá, {user.name ? user.name : "Comercial"} </span>{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-none border-none shadow-none px-2"
                      onClick={() => setOpenDialogVerifyUser(true)}
                    >
                      <Pencil size={16} className="text-blue-600" asChild />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar nome de usuário</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
