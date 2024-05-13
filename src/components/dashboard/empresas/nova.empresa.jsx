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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
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

export const listaDeDocumentos = [
  {
    nome: "Contrato Social ou Estatuto",
    descricao:
      "Documento que estabelece as regras e responsabilidades dos sócios e a estrutura da empresa.",
  },
  {
    nome: "Alvará de Funcionamento",
    descricao: "Autorização para operar em determinado local.",
  },
  {
    nome: "Inscrição Estadual e Municipal",
    descricao:
      "Registro fiscal para operações de venda de mercadorias (ICMS) e prestação de serviços (ISS).",
  },
  {
    nome: "Certificado Digital",
    descricao:
      "Utilizado para assinar documentos eletrônicos e realizar transações online com segurança.",
  },
  {
    nome: "Livros Contábeis e Fiscais",
    descricao:
      "Registros contábeis e fiscais obrigatórios, como Livro Diário, Livro Razão e Livro de Entradas e Saídas.",
  },
  {
    nome: "Documentos Trabalhistas",
    descricao:
      "Contratos de trabalho, folhas de pagamento, recibos de salários, entre outros.",
  },
  {
    nome: "Notas Fiscais",
    descricao:
      "Emissão de notas fiscais para operações de venda de produtos ou prestação de serviços.",
  },
];

function NovaEmpresa() {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState({});
  const [loadingCep, setLoadingCep] = useState(false);
  const { toast } = useToast();
  const { loading, createEmpresa, empresas } = useData();
  const [arquivoZip, setArquivoZip] = useState();
  const [socio, setSocio] = useState({});
  const [documentosSelecionados, setDocumentosSelecionados] = useState({});
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [socios, setSocios] = useState([]);
  const queryClient = useQueryClient();
  const handleTiposDocumentos = (e) => {
    setTipoDocumento(e.target.value);
  };
  const handleFileChange = (event, tipoDocumento) => {
    const files = event.target.files;
    const filesArray = Array.from(files);

    setDocumentosSelecionados((prevState) => ({
      ...prevState,
      [tipoDocumento]: filesArray,
    }));
  };


  const handleDelete = (index) => {
    const updatedDocumentos = [...tiposDocumentos];
    updatedDocumentos.splice(index, 1);
    setTiposDocumentos(updatedDocumentos);
  };

  const handleSaveTipoDocumento = () => {
    if (tipoDocumento === "") {
      toast({
        title: "Tipo de documento vazio",
        variant: "destructive",
      });
      return;
    }
    setTiposDocumentos([...tiposDocumentos, tipoDocumento]);
    setTipoDocumento("");
  };

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
    if (formValues.cpf) {
      const novoSocio = cadastrarSocio();
      setSocios([...socios, novoSocio]);
      console.log(socios);
    } else {
      const empresaSociaEncontrada = empresas.find((emp) => emp.id === socio);
      console.log("encontrado");
      console.log(empresaSociaEncontrada);
      setSocios([...socios, empresaSociaEncontrada]);
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
    setSocio({});
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
                  empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.razaoSocial}
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

  const createZipFolder = async (files) => {
    const zip = new JSZip();
    const arquivosArray = Array.from(files);

    arquivosArray.forEach((file) => {
      zip.file(file.name, file);
    });

    const zipContent = await zip.generateAsync({ type: "blob" });

    return zipContent;
  };

  const onSubmit = async (data) => {
    const requiredFields = ["razaoSocial", "cnpj", "email"];
    for (const field of requiredFields) {
      if (!data[field]) {
        toast({
          title: "Campo obrigatório",
          description: `Por favor, preencha o ${field} da empresa.`,
          variant: "destructive",
        });
        return;
      }
    }

    const addressRequiredFields = ["rua", "numero", "bairro", "cidade"];

    for (const field of addressRequiredFields) {
      if (!data[field]) {
        toast({
          title: "Campo obrigatório",
          description: `Por favor, preencha o ${field} do endereço.`,
          variant: "destructive",
        });
        return;
      }
    }

    data.documentos = documentosSelecionados;
    data.id = v4();
    data.socios = socios;

    await createEmpresa(data);
    setAddress({});
    setCep("");
    setSocio();
    setSocios([]);
    setTiposDocumentos([]);
    setDocumentosSelecionados({});
    reset();
    queryClient.invalidateQueries({ queryKey: ["empresas"] });
  };

  const handleResetFields = () => {
    reset();
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
    <LargeDialog>
      <LargeDialogTrigger className="h-9 px-3  border-none outline-none w-[220px] bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-1 justify-center items-center text-sm">
        <PlusCircle size={14} className="mr-1" />
        Nova empresa
      </LargeDialogTrigger>
      <LargeDialogContent>
        <LargeDialogHeader>
          <LargeDialogTitle className="text-blue-600 font-bold text-xl">
            Cadastrar nova empresa
          </LargeDialogTitle>
        </LargeDialogHeader>
        <Form control={control}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-5  py-1"
          >
            <Tabs defaultValue="step-1" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="step-1">Dados iniciais</TabsTrigger>

                <TabsTrigger value="step-3">Tipo de documentos</TabsTrigger>
                <TabsTrigger value="step-4">Documentos</TabsTrigger>

                <TabsTrigger value="step-5">Sócios (as)</TabsTrigger>
              </TabsList>
              <TabsContent value="step-1">
                <Card className="py-2">
                  <ScrollArea className="h-[450px] ">
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor="nome">Razão Social</Label>
                        <Input {...register("razaoSocial")} id="razaoSocial" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input {...register("cnpj")} id="razaoSocial" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="email">E-mail</Label>
                        <Input {...register("email")} id="email" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="cep">CEP</Label>
                        <div className="flex gap-2 items-center justify-between">
                          <Input
                            id="cep"
                            type="text"
                            {...register("cep")}
                            onChange={(e) => setCep(e.target.value)}
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
                          defaultValue={address.logradouro}
                          type="text"
                          {...register("rua")}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="numero">Número</Label>
                        <Input
                          id="numero"
                          type="text"
                          {...register("numero")}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input
                          id="complemento"
                          defaultValue={address.complemento}
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
                          defaultValue={address.bairro}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          type="text"
                          {...register("cidade")}
                          defaultValue={address.localidade}
                        />
                      </div>
                    </CardContent>
                  </ScrollArea>
                </Card>
              </TabsContent>

              <TabsContent value="step-3">
                <Card className="py-2">
                  <ScrollArea className="h-[450px] ">
                    <CardContent className="space-y-4 ">
                      <div className="space-y-1 w-full flex flex-col gap-2">
                        <Select onValueChange={(e) => setTipoDocumento(e)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um item" />
                          </SelectTrigger>
                          <SelectContent>
                            {listaDeDocumentos.map((item) => (
                              <SelectItem key={item.nome} value={item.nome}>
                                {item.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Label htmlFor="typeDocument">Tipo de documento</Label>
                        <Input
                          type="text"
                          id="typeDocument"
                          value={tipoDocumento}
                          onChange={handleTiposDocumentos}
                          placeholder="Digite o tipo de documento"
                        />
                        <Button
                          size="sm"
                          type="button"
                          onClick={handleSaveTipoDocumento}
                        >
                          Cadastrar tipo
                        </Button>

                        <ul className="space-y-2">
                          {tiposDocumentos.length > 0 &&
                            tiposDocumentos.map((type, index) => (
                              <li
                                key={index}
                                className="w-full flex justify-between text-sm"
                              >
                                <span>{type}</span>
                                <Button
                                  variant="destructive"
                                  size="xs"
                                  type="button"
                                  onClick={() => handleDelete(index)}
                                >
                                  Apagar
                                </Button>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </CardContent>
                  </ScrollArea>
                </Card>
              </TabsContent>
              <TabsContent value="step-4">
                <Card className="py-2">
                  <ScrollArea className="h-[450px]">
                    <CardContent className="space-y-4 ">
                      {tiposDocumentos.length > 0 ? (
                        tiposDocumentos.map((tipo, index) => (
                          <div key={index} className="mb-3">
                            <Label htmlFor={tipo.trim()}>{tipo.trim()}</Label>
                            <Input
                              id={tipo.trim()}
                              type="file"
                              multiple
                              onChange={(e) => handleFileChange(e, tipo)}
                              accept=".pdf,.doc,.xlsx,.xls,.xlsm,.docx, .zip, .rar, .pfx"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="w-full flex justify-center h-[80px] items-center font-bold text-blue-600 text-xl">
                          <span>Nenhum tipo/pasta cadastrado</span>
                        </div>
                      )}
                    </CardContent>
                  </ScrollArea>
                </Card>
              </TabsContent>
              <TabsContent value="step-5">
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
                          <option value="pessoa-fisica">Pessoa física</option>
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

            <LargeDialogFooter className="flex justify-end w-full ">
              <LargeDialogClose
                onClick={handleResetFields}
                type="button"
                className="button-destructive"
              >
                Cancelar
              </LargeDialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="button-primary"
              >
                {loading ? "Cadastrando..." : "Nova empresa"}
              </Button>
            </LargeDialogFooter>
          </form>
        </Form>
      </LargeDialogContent>
    </LargeDialog>
  );
}

export default NovaEmpresa;
