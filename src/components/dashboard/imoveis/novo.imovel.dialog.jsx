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
import { PlusCircle, XCircle } from "lucide-react";
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
  { label: "Conta de luz - Elektro", value: "Conta de luz - Elektro" },
  { label: "Conta de água - SAAE", value: "Conta de água - SAAE" },
  { label: "Matrícula do imóvel", value: "Matrícula do imóvel" },
  { label: "Certidão negativa", value: "Certidão negativa" },
  { label: "Certidão de valor venal", value: "Certidão de valor venal" },
  {
    label: "Contrato de compra e venda",
    value: "Contrato de compra e venda",
  },
  { label: "IPTU", value: "IPTU" },
  { label: "Habite-se", value: "Habite-se" },
  { label: "Condomínio", value: "Condomínio" },
  { label: "Alteração cadastral", value: "Alteração cadastral" },
  { label: "Contrato Social", value: "Contrato Social" },
  { label: "Plantas", value: "Plantas" },
];

function NovoImovelDialog() {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState({});
  const [loadingCep, setLoadingCep] = useState(false);
  const { toast } = useToast();
  const { loading, createImovel } = useData();
  const [arquivoZip, setArquivoZip] = useState();
  const [proprietario, setProprietario] = useState({});
  const [documentosSelecionados, setDocumentosSelecionados] = useState({});
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [tipoDocumento, setTipoDocumento] = useState("");
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

    data.documentos = documentosSelecionados;
    data.id = v4();
    data.proprietario = proprietario;

    await createImovel(data);
    setAddress({});
    setCep("");
    setProprietario({});
    setTiposDocumentos([]);
    setDocumentosSelecionados({});
    reset();
    console.log(Object.values(documentosSelecionados));
    queryClient.invalidateQueries({ queryKey: ["imoveis"] });
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
        Novo imóvel
      </LargeDialogTrigger>
      <LargeDialogContent>
        <LargeDialogHeader>
          <LargeDialogTitle>Cadastrar imóvel</LargeDialogTitle>
        </LargeDialogHeader>
        <Form control={control}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-5 justify-center py-4"
          >
            <Tabs defaultValue="step-1" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="step-1">Dados iniciais</TabsTrigger>
                <TabsTrigger value="step-2">Endereço</TabsTrigger>
                <TabsTrigger value="step-3">Tipo de documentos</TabsTrigger>
                {tiposDocumentos.length > 0 && (
                  <TabsTrigger value="step-4">Documentos</TabsTrigger>
                )}
                <TabsTrigger value="step-5">Proprietário (a)</TabsTrigger>
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
                    <div className="space-y-1 w-full flex flex-col gap-2">
                      <Select onValueChange={(e) => setTipoDocumento(e)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um item" />
                        </SelectTrigger>
                        <SelectContent>
                          {listaDeDocumentos.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
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
                </Card>
              </TabsContent>
              <TabsContent value="step-4">
                {tiposDocumentos.length > 0 &&
                  tiposDocumentos.map((tipo, index) => (
                    <div key={index} className="mb-3">
                      <Label htmlFor={tipo.trim()}>{tipo.trim()}</Label>
                      <Input
                        id={tipo.trim()}
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e, tipo)}
                        accept=".pdf,.doc,.xlsx,.xls,.xlsm,.docx"
                      />
                    </div>
                  ))}
              </TabsContent>
              <TabsContent value="step-5">
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
              </TabsContent>
            </Tabs>

            <LargeDialogFooter className="flex justify-end w-full mt-3">
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
                {loading ? "Cadastrando..." : "Novo imóvel"}
              </Button>
            </LargeDialogFooter>
          </form>
        </Form>
      </LargeDialogContent>
    </LargeDialog>
  );
}

export default NovoImovelDialog;
