import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { PlusCircle, XCircle } from "lucide-react";
import { v4 } from "uuid";
import { ToastAction } from "@/components/ui/toast";

function NovoImovelDialog() {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState({});
  const [loadingCep, setLoadingCep] = useState(false);
  const [saveDocument, setSaveDocument] = useState(false);
  const { toast } = useToast();
  const { loading, createImovel } = useData();
  const [arquivos, setArquivos] = useState([]);
  const [tipoArquivo, setTipoArquivo] = useState("");
  const [documento, setDocumento] = useState();
  const [arquivosSalvos, setArquivosSalvos] = useState([]);
  const [arquivoZip, setArquivoZip] = useState();
  const [proprietario, setProprietario] = useState({});
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

  const cadastrarProprietario = () => {
    if (tipoPessoa === "pessoa-juridica") {
      const { razaoSocial, cnpj, email, telefone } = formValues;
      const novoProprietario = {
        razaoSocial,
        cnpj,
        email,
        telefone,
        tipoPessoa,
      };
      return novoProprietario;
    }
    if (tipoPessoa === "pessoa-fisica") {
      const { nome, cpf, email, telefone } = formValues;
      const novoProprietario = {
        nome,
        cpf,
        email,
        telefone,
        tipoPessoa,
      };
      return novoProprietario;
    }
  };

  const handleCadastroProprietario = () => {
    const novoProprietario = cadastrarProprietario();
    setProprietario(novoProprietario);
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
              <Button type="button" onClick={handleCadastroProprietario}>
                Cadastrar proprietário
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } else if (tipoPessoa === "pessoa-juridica") {
      return (
        <Card className="mt-2">
          <CardContent className="py-2">
            <div>
              <Label htmlFor="razaoSocial">Razão social:</Label>
              <Input
                type="text"
                id="razaoSocial"
                name="razaoSocial"
                value={formValues.razaoSocial}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="cpf">CNPJ</Label>
              <Input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formValues.cnpj}
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
              <Button type="button" onClick={handleCadastroProprietario}>
                Cadastrar proprietário
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

  const handleChangeTipoArquivo = (event) => {
    setTipoArquivo(event.target.value);
  };

  const salvarTipoArquivo = async () => {
    if (arquivos.length > 0) {
      const tipoDuplicado = arquivos.find((arquivo) => arquivo === tipoArquivo);

      if (tipoDuplicado) {
        toast({
          title: "Tipo de arquivo duplicado!",
          description: "O tipo de arquivo será duplicado",
          variant: "destructive",
          action: (
            <ToastAction
              altText="Salvar mesmo assim"
              onClick={() => setArquivos([...arquivos, tipoArquivo])}
            >
              Continuar
            </ToastAction>
          ),
        });
        return;
      }
    }
    setArquivos([...arquivos, tipoArquivo]);
  };

  const handleCreateDocument = (i) => {
    const novoDocumento = {
      arquivo: documento,
      tipo: arquivos[i],
      save: true,
      id: v4(),
      index: i,
    };

    setArquivosSalvos([...arquivosSalvos, novoDocumento]);

    setDocumento();
  };

  const handleChangeFileInput = (e) => {
    setDocumento(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    const requiredFields = ["nome", "empresa", "type"];

    for (const field of requiredFields) {
      if (!data[field]) {
        toast({
          title: "Campo obrigatório",
          description: `Por favor, preencha o ${field} do imóvel.`,
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
    data.id = v4();
    await createImovel(data);
    setAddress({});
    setCep("");
    reset();
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
    <Dialog>
      <DialogTrigger className="h-9 px-3  border-none outline-none w-[220px] bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-1 justify-center items-center text-sm">
        <PlusCircle size={14} className="mr-1" />
        Novo imóvel
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar imóvel</DialogTitle>
        </DialogHeader>
        <Form control={control}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-5 justify-center py-4"
          >
            <Tabs defaultValue="step-1" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="step-1">Dados iniciais</TabsTrigger>
                <TabsTrigger value="step-2">Endereço</TabsTrigger>
                <TabsTrigger value="step-3">Documentos</TabsTrigger>
                <TabsTrigger value="step-4">Proprietário (a)</TabsTrigger>
              </TabsList>
              <TabsContent value="step-1">
                <Card className="py-4">
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="nome">Nome do imóvel</Label>
                      <Input {...register("nome")} id="nome" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="empresa">Empresa</Label>
                      <select
                        {...register("empresa")}
                        className="bg-gray-50 border border-gray-300 text-stone-700 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2  dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option className="cursor-pointer" value="">
                          Empresa
                        </option>
                        <option className="cursor-pointer" value="nenhuma">
                          Nenhuma
                        </option>
                        <option className="cursor-pointer" value="makehome">
                          Make Home
                        </option>
                        <option className="cursor-pointer" value="mdk">
                          MDK Construtora
                        </option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="type">Tipo do imóvel</Label>
                      <select
                        {...register("type")}
                        className="bg-gray-50 border border-gray-300 text-stone-700 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2  dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option className="cursor-pointer" value="">
                          Tipo do imóvel
                        </option>
                        <option className="cursor-pointer" value="casa">
                          Casa
                        </option>
                        <option className="cursor-pointer" value="apartamento">
                          Apartamento
                        </option>
                        <option className="cursor-pointer" value="residencial">
                          Residencial
                        </option>
                        <option className="cursor-pointer" value="terreno">
                          Terreno
                        </option>
                      </select>
                    </div>
                    {/* <div className="space-y-1">
                      <Label htmlFor="type">Status </Label>
                      <select
                        {...register("type")}
                        className="bg-gray-50 border border-gray-300 text-stone-700 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2  dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option className="cursor-pointer" value="">
                        Status
                        </option>
                        <option className="cursor-pointer" value="casa">
                          Obra em andamento
                        </option>
                        <option className="cursor-pointer" value="apartamento">
                         
                        </option>
                        <option className="cursor-pointer" value="residencial">
                          Residencial
                        </option>
                        <option className="cursor-pointer" value="terreno">
                          Terreno
                        </option>
                      </select>
                    </div> */}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="step-2">
                <ScrollArea className="h-[300px] w-full">
                  <Card className="py-4">
                    <CardContent className="space-y-2">
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
                  </Card>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="step-3">
                <Card className="py-4">
                  <CardContent className="space-y-2">
                    <div className="space-y-1 w-full flex gap-6">
                      <div className="w-1/2 space-y-2">
                        <Label htmlFor="tipo-de-arquivo">
                          Tipo de documento
                        </Label>
                        <Input
                          id="tipo-de-arquivo"
                          type="text"
                          onChange={(e) => handleChangeTipoArquivo(e)}
                          placeholder="Tipo de arquivo"
                        />
                        <Button type="button" onClick={salvarTipoArquivo}>
                          Salvar
                        </Button>
                      </div>
                      <div className="w-1/2">
                        <span className="text-md font-bold text-stone-700">
                          Selecione os arquivos
                        </span>
                        <ScrollArea className="h-[400px] flex flex-col ">
                          {arquivos.length > 0 &&
                            arquivos.map((tipo, index) => (
                              <div className="mt-3 ">
                                {arquivosSalvos.length > 0 &&
                                  arquivosSalvos.map(
                                    (aqsalvo) => aqsalvo.save && <>salvo</>
                                  ) && <>Salvo</>}
                                <Label htmlFor={tipo}>{tipo}</Label>
                                <Input
                                  id={tipo}
                                  onChange={handleChangeFileInput}
                                  type="file"
                                  accept=".pdf,.xls,.xlsx,.xlsm,image/png,image/jpeg"
                                />
                                <div className="w-full flex justify-end">
                                  <Button
                                    size="xs"
                                    className="mt-2 "
                                    type="button"
                                    onClick={() => handleCreateDocument(index)}
                                  >
                                    Salvar documento
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </ScrollArea>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="step-4">
                {Object.values(proprietario).length > 0 && (
                  <div>
                    <span className="font-bold ">Proprietário cadastrado</span>
                    <div>
                      <span className="text-sm">
                        Proprietário{" "}
                        <span className="font-semibold">
                          {(proprietario.nome && proprietario.nome) ||
                            (proprietario.razaoSocial &&
                              proprietario.razaoSocial)}
                        </span>{" "}
                        inscrito no documento{" "}
                        <span className="font-semibold">
                          {(proprietario.cnpj && proprietario.cnpj) ||
                            (proprietario.cpf && proprietario.cpf)}
                          .
                        </span>
                      </span>
                    </div>
                  </div>
                )}
                {Object.values(proprietario).length === 0 && (
                  <>
                    <div className="space-y-1 mt-6">
                      <label htmlFor="type">Pessoa física ou jurídica:</label>
                      <select
                        className="bg-gray-50 border border-gray-300 text-stone-700 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2 dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={tipoPessoa}
                        onChange={handleTipoPessoaChange}
                      >
                        <option value="">Física ou Jurídica</option>
                        <option value="pessoa-fisica">Pessoa física</option>
                        <option value="pessoa-juridica">Pessoa jurídica</option>
                      </select>
                    </div>
                    {renderizarFormulario()}
                  </>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-end w-full mt-3">
              <DialogClose
                onClick={handleResetFields}
                type="button"
                className="button-destructive"
              >
                Cancelar
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="button-primary"
              >
                Novo imóvel {loading ? "Cadastrando..." : ""}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default NovoImovelDialog;
