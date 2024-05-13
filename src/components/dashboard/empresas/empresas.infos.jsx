"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  LargeDialog,
  LargeDialogClose,
  LargeDialogContent,
  LargeDialogFooter,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogTrigger,
} from "@/components/ui/large-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCep } from "@/services/viacep";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import useData from "@/hooks/useData";
import JSZip from "jszip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash, XCircle } from "lucide-react";
import { v4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "react-query";

function EmpresaInfos({ empresa }) {
  const { rua, numero, bairro, cidade } = empresa;
  const endereco = `${rua} - ${numero}`;
  const outrasInfosEndereco = `${bairro} - ${cidade}`;
  const [editarEmpresa, setEditarEmpresa] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState({});
  const [loadingCep, setLoadingCep] = useState(false);
  const { empresas, atualizarDados, apagarDados } = useData();
  const [socio, setSocio] = useState({});
  const [socios, setSocios] = useState([]);

  useEffect(() => {
    if (empresa.socios) setSocios(empresa.socios);
  }, []);
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState({
    razaoSocial: "",
    cnpj: "",
    email: "",
    telefone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const cadastrarSocio = () => {
    const { nome, cpf, email, telefone } = formValues;
    const novoSocio = {
      nome,
      cpf,
      email,
      telefone,
      tipoPessoa,
      id: v4(),
    };
    return novoSocio;
  };

  const handleCadastroSocio = () => {
    if (!socio.cnpj) {
      const novoSocio = cadastrarSocio();
      console.log("Sócio CPF");
      console.log(novoSocio);
      setSocios([...socios, novoSocio]);
      console.log(socios);
    } else {
      const novoSocio = {
        socio,
        id: v4(),
      };
      setSocios([...socios, novoSocio]);
    }
    if (tipoPessoa === "pessoa-juridica") {
      setFormValues({
        razaoSocial: "",
        cnpj: "",
        email: "",
        telefone: "",
      });
    } else {
      setFormValues({
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
      });
    }
  };
  const [tipoPessoa, setTipoPessoa] = useState("");

  const handleTipoPessoaChange = (e) => {
    setTipoPessoa(e.target.value);
  };

  const deletarSocio = (email) => {
    const sociosFiltrados = socios.filter((sco) => sco.email !== email);
    setSocios(sociosFiltrados);
  };

  const renderizarFormulario = () => {
    if (tipoPessoa === "pessoa-fisica") {
      return (
        <Card className="mt-2">
          <CardContent className="py-2">
            <div>
              <Label htmlFor="nome">Nome:</Label>
              <Input
                type="text"
                id="nome"
                name="nome"
                value={formValues.nome}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF:</Label>
              <Input
                type="text"
                id="cpf"
                name="cpf"
                value={formValues.cpf}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone para contato</Label>
              <Input
                type="telefone"
                id="telefone"
                name="telefone"
                value={formValues.telefone}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-5 w-full flex justify-end">
              <Button type="button" onClick={handleCadastroSocio}>
                Cadastrar sócio
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } else if (tipoPessoa === "pessoa-juridica") {
      return (
        <Card className="mt-2">
          <CardContent className="py-2">
            <Select onValueChange={(e) => setSocio(e)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um item" />
              </SelectTrigger>
              <SelectContent>
                {empresas &&
                  empresas.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.razaoSocial}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="mt-5 w-full flex justify-end">
              <Button type="button" onClick={handleCadastroSocio}>
                Cadastrar Sócio
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const onSubmit = async (data) => {
    data.socios = socios;

    const type = "empresas";
    await atualizarDados(type, empresa.id, data);

    setAddress({});
    setCep("");
    setSocio();
    setSocios([]);
    reset();

    queryClient.invalidateQueries({ queryKey: ["empresas"] });
  };

  const searchCep = async () => {
    setLoadingCep(true);
    try {
      const addr = await fetchCep(cep);
      setTimeout(() => {
        setLoadingCep(false);
        setAddress(addr);
        setValue("rua", addr.logradouro);
        setValue("bairro", addr.bairro);
        setValue("cidade", addr.localidade);
      }, 150);
    } catch (error) {
      setTimeout(() => {
        setLoadingCep(false);
      }, 1500);
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="h-9  px-3 border-none outline-none  bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-1 justify-center items-center text-sm">
        Informações
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="w-full flex justify-between items-center pr-4">
            <DialogTitle>Informações da empresa</DialogTitle>
            <div className="flex gap-1 items-center">
              <Button
                size="xs"
                type="button"
                onClick={() => setEditarEmpresa(!editarEmpresa)}
              >
                Editar dados
              </Button>
              <Button
                size="xs"
                type="button"
                variant="destructive"
                onClick={() => apagarDados(empresa.id, queryClient)}
              >
                Apagar empresa
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="py-4">
              {!editarEmpresa && (
                <ul className="space-y-3">
                  <li>
                    <strong>Razão social:</strong> {empresa.razaoSocial}
                  </li>
                  <li>
                    <strong>CNPJ:</strong> {empresa.cnpj}
                  </li>
                  <li className="w-full flex flex-col">
                    <span>
                      <strong>Endereço:</strong> {endereco}
                    </span>
                    <span>
                      {outrasInfosEndereco} -{" "}
                      <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${empresa.cep}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>{cep}</TooltipTrigger>
                            <TooltipContent>
                              <p>Clique para visualizar no mapa.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Link>
                    </span>
                  </li>
                  <li className=" w-full flex flex-col">
                    <span className="font-bold text-stone-800">Sócios:</span>
                    {empresa.socios &&
                      empresa.socios.map((socio) => (
                        <span key={socio.id}>
                          {socio.nome || socio.razaoSocial}
                        </span>
                      ))}
                  </li>
                </ul>
              )}
              {editarEmpresa && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Tabs defaultValue="step-1" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="step-1">Dados iniciais</TabsTrigger>

                      <TabsTrigger value="step-2">Sócios (as)</TabsTrigger>
                    </TabsList>
                    <TabsContent value="step-1">
                      <Card className="py-2">
                        <ScrollArea className="h-[450px] ">
                          <CardContent className="space-y-4">
                            <div className="space-y-1">
                              <Label htmlFor="nome">Razão Social</Label>
                              <Input
                                {...register("razaoSocial")}
                                id="razaoSocial"
                                defaultValue={empresa.razaoSocial}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="cnpj">CNPJ</Label>
                              <Input
                                {...register("cnpj")}
                                id="razaoSocial"
                                defaultValue={empresa.cnpj}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="email">E-mail</Label>
                              <Input
                                {...register("email")}
                                id="email"
                                defaultValue={empresa.email}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="cep">CEP</Label>
                              <div className="flex gap-2 items-center justify-between">
                                <Input
                                  id="cep"
                                  type="text"
                                  {...register("cep")}
                                  onChange={(e) => setCep(e.target.value)}
                                  defaultValue={empresa.cep}
                                />
                                <Button
                                  className="ml-3"
                                  type="button"
                                  onClick={searchCep}
                                  disabled={loadingCep}
                                >
                                  {!loadingCep ? "Buscar" : "Buscando..."}
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => setAddress({})}
                                  className="w-auto p-3"
                                  variant="destructive"
                                >
                                  <XCircle size={22} />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="rua">Rua</Label>
                              <Input
                                id="rua"
                                defaultValue={empresa.rua}
                                type="text"
                                {...register("rua")}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="numero">Número</Label>
                              <Input
                                id="numero"
                                type="text"
                                defaultValue={empresa.numero}
                                {...register("numero")}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="complemento">Complemento</Label>
                              <Input
                                id="complemento"
                                defaultValue={
                                  empresa.complemento && empresa.complemento
                                }
                                type="text"
                                {...register("complemento")}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="bairro">Bairro</Label>
                              <Input
                                id="bairro"
                                type="text"
                                {...register("bairro")}
                                defaultValue={empresa.bairro}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="cidade">Cidade</Label>
                              <Input
                                id="cidade"
                                type="text"
                                {...register("cidade")}
                                defaultValue={empresa.cidade}
                              />
                            </div>
                          </CardContent>
                        </ScrollArea>
                      </Card>
                    </TabsContent>

                    <TabsContent value="step-2">
                      <Card className="py-2">
                        <ScrollArea className="h-[450px]">
                          <CardContent className="space-y-4">
                            {socios.length > 0 && (
                              <div>
                                <span className="font-bold text-md text-blue-600">
                                  Sócios cadastrados
                                </span>
                                <ul>
                                  {socios.map((sc) => (
                                    <li
                                      key={sc.email}
                                      className="w-full flex justify-between py-2 hover:bg-stone-200 px-2 items-center rounded-md duration-400 transition-all shadow-none cursor-pointer hover:shadow-md"
                                    >
                                      <span>{sc.nome || sc.razaoSocial}</span>{" "}
                                      <Trash
                                        size={18}
                                        onClick={() => deletarSocio(sc.email)}
                                        className="text-red-600 cursor-pointer"
                                      />
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="space-y-1 mt-6">
                              <label htmlFor="type" className="text-sm">
                                Selecione o tipo de pessoa: física ou jurídica:
                              </label>
                              <select
                                className="bg-gray-50 border border-gray-300 text-stone-700 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={tipoPessoa}
                                onChange={handleTipoPessoaChange}
                              >
                                <option value="">Física ou Jurídica</option>
                                <option value="pessoa-fisica">
                                  Pessoa física
                                </option>
                                <option value="pessoa-juridica">
                                  Pessoa jurídica
                                </option>
                              </select>
                            </div>
                            {renderizarFormulario()}
                          </CardContent>
                        </ScrollArea>
                      </Card>
                    </TabsContent>
                  </Tabs>
                  <div className="w-full flex justify-end">
                    <Button className="mt-3">Atualizar</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EmpresaInfos;
