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
import {
  Eye,
  IterationCw,
  Plus,
  PlusCircle,
  Trash,
  X,
  XCircle,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "react-circular-progressbar/dist/styles.css";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCep } from "@/services/viacep";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import CurrencyInput from "react-currency-input-field";
import { useToast } from "@/components/ui/use-toast";
import useData from "@/hooks/useData";
import { v4 } from "uuid";
import JSZip from "jszip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listaDeDocumentos } from "../imoveis/novo.imovel.dialog";

function NewNegotiationDialog() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const form = useForm();
  const [documentosSelecionados, setDocumentosSelecionados] = useState({});
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [tipoDocumento, setTipoDocumento] = useState("");

  const [cep, setCep] = useState("");
  const [numeroApto, setNumeroApto] = useState(0);
  const [address, setAddress] = useState({});
  const [loadingCep, setLoadingCep] = useState(false);
  const [type, setType] = useState("");
  const [modelos, setModelos] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [newNames, setNewNames] = useState({});
  const [documentos, setDocumentos] = useState([]);
  const [saveDocument, setSaveDocument] = useState(false);
  const [modeloSelecionado, setModeloSelecionado] = useState({});
    const [selectedType, setSelectedType] = useState("");
    const { toast } = useToast();
    const [model, setModel] = useState({
      id: "",
      type: "",
      quartos_simples: "",
      suites: "",
      banheiros: "",
      vagas: "",
      price: "",
      numeroApto: numeroApto,
      documentos: [],
      imagens: [],
    });

    const { create, loading, empresas, imoveis } = useData();
    const changeModelInputs = (event) => {
      const { name, value } = event.target;
      setModel({
        ...model,
        [name]: value,
      });
    };
    const changeModelType = (event) => {
      setModel({
        ...model,
        type: event,
      });
    };

    const changeModelFile = (event) => {
      const { name, files } = event.target;
      setModel({
        ...model,
        [name]: files,
      });
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

    const handleTypeChange = (event) => {
      const selectedValue = event.target.value;
      setSelectedType(selectedValue);
      // Define o valor selecionado no formulário
      setValue("type", selectedValue);
    };

    const handleTiposDocumentos = (e) => {
      setTipoDocumento(e.target.value);
    };
    const handleDocumentos = (event) => {
      const fileList = event.target.files;
      const newArquivos = Array.from(fileList).map((file) => file);
      setDocumentos([...documentos, ...newArquivos]);
      setModel({
        ...model,
        documentos: [...documentos, ...newArquivos],
      });
    };
    // Função para atualizar o nome do documento
    const handleNameChange = (documentoId, newName) => {
      setNewNames((prevNames) => ({
        ...prevNames,
        [documentoId]: newName,
      }));
    };
    const handleFileChange = (event, tipoDocumento) => {
      const files = event.target.files;
      const filesArray = Array.from(files);

      setDocumentosSelecionados((prevState) => ({
        ...prevState,
        [tipoDocumento]: filesArray,
      }));
    };
    function renameDocuments() {
      if (saveDocument) {
        setSaveDocument(false);
        return;
      }
      if (
        !newNames ||
        typeof newNames !== "object" ||
        Array.isArray(newNames)
      ) {
        console.error(
          "Por favor, forneça um objeto de novos nomes para os documentos."
        );
        return;
      }

      const documentosIds = Object.keys(model.documentos);
      if (documentosIds.length !== Object.keys(newNames).length) {
        console.error(
          "O número de novos nomes não corresponde ao número de documentos."
        );
        return;
      }

      documentosIds.forEach((documentoId) => {
        if (newNames[documentoId]) {
          model.documentos[documentoId].nome = newNames[documentoId];
        }
      });

      toast({
        title: "Documentos salvos com sucesso!",
        variant: "success",
      });
      setSaveDocument(!saveDocument);

      return model.documentos;
    }

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
      switch (true) {
        case data.nome === "":
          toast({
            title: "Campo obrigatório",
            description: "Por favor, preencha o nome do empreendimento.",
            variant: "destructive",
          });
          return;
        case data.chaves === "":
          toast({
            title: "Campo obrigatório",
            description:
              "Por favor, preencha a quantidade de chaves do empreendimento.",
            variant: "destructive",
          });
        case data.empresa === "":
          toast({
            title: "Campo obrigatório",
            description: "Por favor, selecione a empresa do empreendimento.",
            variant: "destructive",
          });
          return;
        case data.type === "":
          toast({
            title: "Campo obrigatório",
            description: "Por favor, selecione o tipo do empreendimento.",
            variant: "destructive",
          });
          return;
        case !modelos || modelos.length === 0:
          toast({
            title: "Campo obrigatório",
            description: "Por favor, adicione pelo menos um modelo de imóvel.",
            variant: "destructive",
          });
          return;
        case data.rua === "" ||
          data.numero === "" ||
          data.bairro === "" ||
          data.cidade === "":
          switch (true) {
            case data.rua === "":
              toast({
                title: "Campo obrigatório",
                description: "Por favor, preencha a rua do endereço.",
                variant: "destructive",
              });
              return;
            case data.numero === "":
              toast({
                title: "Campo obrigatório",
                description: "Por favor, preencha o número do endereço.",
                variant: "destructive",
              });
              return;
            case data.bairro === "":
              toast({
                title: "Campo obrigatório",
                description: "Por favor, preencha o bairro do endereço.",
                variant: "destructive",
              });
              return;
            case data.cidade === "":
              toast({
                title: "Campo obrigatório",
                description: "Por favor, preencha a cidade do endereço.",
                variant: "destructive",
              });
              return;
            default:
              return;
          }
        default:
          data.documentos = documentosSelecionados;
          await create(data, modelos);
          reset();
          setModelos([]);

          return;
      }
    };
    const handleResetFields = () => {
      reset();
    };
    const apagarModelo = (index) => {
      setModelos((prevModelos) => {
        const updateModelos = [...prevModelos];
        updateModelos.splice(index, 1);
        return updateModelos;
      });
    };
    const createModel = async () => {
      const errors = [];

      if (!model.quartos_simples)
        errors.push("Por favor, preencha a quantidade de quartos simples.");
      if (!model.suites) errors.push("Por favor, preencha o número de suítes.");
      if (!model.banheiros)
        errors.push("Por favor, preencha o número de banheiros.");
      if (!model.vagas) errors.push("Por favor, preencha o número de vagas.");
      if (!model.price) errors.push("Por favor, preencha o preço do imóvel.");
      if (!model.area_total)
        errors.push("Por favor, preencha a área total do imóvel.");
      if (!model.lavabos)
        errors.push("Por favor, preencha a quantidade de lavabos.");
      if (!model.area_construida)
        errors.push("Por favor, preencha a área construída do imóvel.");
      if (selectedType === "apartamento" && !model.numeroApto)
        errors.push("Por favor, preencha o número do apartamento.");
      if (!model.documentos)
        errors.push("Por favor, adicione os documentos do imóvel.");
      if (!model.imagens)
        errors.push("Por favor, adicione as imagens do imóvel.");

      if (errors.length > 0) {
        errors.forEach((error) => alert(error));
        return;
      }

      if (model.imagens && model.imagens.length > 0) {
        const fileImage = await createZipFolder(model.imagens);
        model.fileImage = fileImage; // Adiciona o arquivo de imagem ao modelo
      }

      if (model.documentos && model.documentos.length > 0) {
        const fileDocument = await createZipFolder(model.documentos);
        model.fileDocument = fileDocument; // Adiciona o arquivo de documento ao modelo
      }

      model.id = v4();
      setModelos([...modelos, model]);
      setSaveDocument(false);

      setDocumentos([]);
      setModel({
        type: "",
        quartos_simples: "",
        suites: "",
        banheiros: "",
        lavabos: "",
        vagas: "",
        price: "",
        numeroApto: numeroApto,
        documentos: [],
        imagens: [],
        area_construida: "",
        area_total: "",
      });
    };

    const searchCep = async () => {
      setLoadingCep(true);
      try {
        const addr = await fetchCep(cep);
        setTimeout(() => {
          setLoadingCep(false);
          console.log(addr);
          setAddress(addr);
          setValue("rua", addr.logradouro);
          setValue("bairro", addr.bairro);
          setValue("cidade", addr.localidade);
        }, 150);

        // console.log(addr);
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
          Novo empreendimento
        </LargeDialogTrigger>
        <LargeDialogContent>
          <LargeDialogHeader>
            <LargeDialogTitle>Cadastrar empreendimento</LargeDialogTitle>
          </LargeDialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center gap-5 justify-center py-4"
            >
              <Tabs defaultValue="step-1" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="step-1">Dados iniciais </TabsTrigger>
                  <TabsTrigger value="step-2">
                    Documentação do empreendimento
                  </TabsTrigger>
                  <TabsTrigger value="step-3">
                    Inserir documentos do emp.
                  </TabsTrigger>
                  <TabsTrigger value="step-4">Modelos</TabsTrigger>
                </TabsList>
                <TabsContent value="step-1">
                  <Card className="py-4">
                    <ScrollArea className="h-[400px]">
                      <CardContent className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="name">Nome do empreendimento</Label>
                          <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    {...register("nome")}
                                    id="nome"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="chaves">
                            Quantidade de chaves do empreendimento
                          </Label>
                          <FormField
                            control={form.control}
                            name="chaves"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    id="chaves"
                                    type="number"
                                    min="0"
                                    max="100"
                                    name="chaves"
                                    {...register("chaves")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="empresa">Empresa</Label>
                          <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <select
                                    {...register("empresa")}
                                    className="bg-gray-50 border border-gray-300 text-stone-700 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2  dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  >
                                    <option className="cursor-pointer" value="">
                                      Empresa
                                    </option>

                                    {empresas &&
                                      empresas.map((empresa) => (
                                        <option
                                          className="cursor-pointer"
                                          value={empresa}
                                          key={empresa.id}
                                        >
                                          {empresa.razaoSocial}
                                        </option>
                                      ))}
                                  </select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="refImovel">
                            Referência do imóvel
                          </Label>
                          <FormField
                            control={form.control}
                            name="refImovel"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <select
                                    {...register("refImovel")}
                                    className="bg-gray-50 border border-gray-300 text-stone-700 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2  dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  >
                                    <option className="cursor-pointer" value="">
                                      Referência do imóvel
                                    </option>

                                    {imoveis &&
                                      imoveis.map((imovel) => (
                                        <option
                                          className="cursor-pointer"
                                          value={imovel}
                                          key={imovel.id}
                                        >
                                          {imovel.nome}
                                        </option>
                                      ))}
                                  </select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="type">Tipo do empreendimento</Label>
                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <select
                                  {...register("type")}
                                  className="bg-gray-50 border border-gray-300 text-stone-700 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2  dark:bg-stone-900 dark:border-blue-900 dark:placeholder-stone-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  onChange={handleTypeChange}
                                >
                                  <option className="cursor-pointer" value="">
                                    Tipo do empreendimento
                                  </option>
                                  <option
                                    className="cursor-pointer"
                                    value="casa"
                                  >
                                    Casa
                                  </option>
                                  <option
                                    className="cursor-pointer"
                                    value="apartamento"
                                  >
                                    Apartamento
                                  </option>
                                  <option
                                    className="cursor-pointer"
                                    value="residencial"
                                  >
                                    Residencial
                                  </option>
                                </select>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="cep">CEP</Label>
                          <div className="flex gap-2">
                            <FormField
                              control={form.control}
                              name="cep"
                              render={({ field }) => (
                                <FormItem>
                                  <Input
                                    {...field}
                                    id="cep"
                                    type="text"
                                    {...register("cep")}
                                    onChange={(e) => setCep(e.target.value)}
                                  />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              onClick={searchCep}
                              disabled={loadingCep}
                            >
                              {!loadingCep && "Buscar"}
                              {loadingCep && "Buscando..."}
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
                          <FormField
                            control={form.control}
                            name="cep"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  {...field}
                                  id="rua"
                                  defaultValue={address && address.logradouro}
                                  type="text"
                                  {...register("rua")}
                                />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="numero">Número</Label>

                          <FormField
                            control={form.control}
                            name="cep"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  {...field}
                                  id="numero"
                                  type="text"
                                  {...register("numero")}
                                />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="complemento">Complemento</Label>

                          <FormField
                            control={form.control}
                            name="cep"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  {...field}
                                  id="complemento"
                                  type="text"
                                  defaultValue={address && address.complemento}
                                  {...register("complemento")}
                                />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="bairro">Bairro</Label>

                          <FormField
                            control={form.control}
                            name="cep"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  {...field}
                                  id="bairro"
                                  type="text"
                                  {...register("bairro")}
                                  defaultValue={address && address.bairro}
                                />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="cidade">Cidade</Label>

                          <FormField
                            control={form.control}
                            name="cep"
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  {...field}
                                  id="cidade"
                                  type="text"
                                  defaultValue={address && address.localidade}
                                  {...register("cidade")}
                                />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </ScrollArea>
                  </Card>
                </TabsContent>
                <TabsContent value="step-2">
                  <Card className="py-4">
                    <ScrollArea className="h-[400px]">
                      <CardContent className="space-y-3">
                        <div className="space-y-1 w-full flex flex-col gap-2">
                          <span className="font-bold text-blue-600 text-lg mb-2">
                            Selecione os tipos de documentos que deseja
                            cadastrar
                          </span>
                          <Label htmlFor="docsPre">
                            Documentos predefenidos
                          </Label>

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
                          <Label htmlFor="typeDocument">
                            Tipo de documento
                          </Label>
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
                <TabsContent value="step-3">
                  <Card>
                    <ScrollArea className="h-[400px] ">
                      <CardContent className="space-y-4 py-4">
                        {tiposDocumentos.length > 0 ? (
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
                <TabsContent value="step-4">
                  <Card className="py-4">
                    {!viewMode && (
                      <ScrollArea className="h-[400px] w-full">
                        <CardContent className="space-y-4">
                          <div className="w-full flex gap-2 items-center justify-between mb-3">
                            <span className="text-blue-600 font-bold text-lg">
                              Crie os modelos de imóvel que este empreendimento
                              gerou.
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setViewMode(true)}
                              className=" flex px-3  gap-1 justify-around text-sm"
                            >
                              <Eye size={14} /> Ver modelos
                            </Button>
                          </div>

                          <div className="w-full flex gap-2">
                            <div className="space-y-1">
                              <Label htmlFor="quartos_simples">
                                Quantidade de quartos simples
                              </Label>
                              <Input
                                id="quartos_simples"
                                type="number"
                                name="quartos_simples"
                                value={model.quartos_simples}
                                onChange={changeModelInputs}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="suites">Suites</Label>
                              <Input
                                id="suites"
                                type="number"
                                name="suites"
                                value={model.suites}
                                onChange={changeModelInputs}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="banheiros">Banheiros</Label>
                              <Input
                                id="banheiros"
                                name="banheiros"
                                type="number"
                                value={model.banheiros}
                                onChange={changeModelInputs}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="vagas">Vagas</Label>
                              <Input
                                id="vagas"
                                type="number"
                                name="vagas"
                                value={model.vagas}
                                onChange={changeModelInputs}
                              />
                            </div>
                          </div>
                          <div className="w-full flex gap-2">
                            <div className="space-y-1">
                              <Label htmlFor="price">Preço</Label>
                              {/* <Input
                                id="price"
                                type="number"
                                name="price"
                                onChange={changeModelInputs}
                              /> */}
                              <CurrencyInput
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                id="price"
                                name="price"
                                value={model.price}
                                decimalsLimit={2}
                                onValueChange={(value, name, values) =>
                                  setModel({
                                    ...model,
                                    [name]: value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="suites">Lavabos</Label>
                              <Input
                                id="lavabos"
                                type="number"
                                name="lavabos"
                                value={model.lavabos}
                                onChange={changeModelInputs}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="area_total">Área Total</Label>
                              <Input
                                id="area_total"
                                type="text"
                                name="area_total"
                                value={model.area_total}
                                onChange={changeModelInputs}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="area_construida">
                                Área Construída
                              </Label>
                              <Input
                                name="area_construida"
                                id="area_construida"
                                value={model.area_construida}
                                type="text"
                                onChange={changeModelInputs}
                              />
                            </div>
                            {selectedType === "apartamento" && (
                              <div className="space-y-1">
                                <Label htmlFor="numeroApto">
                                  Número do apartamento
                                </Label>
                                <Input
                                  name="numeroApto"
                                  id="numeroApto"
                                  value={model.numeroApto}
                                  type="number"
                                  onChange={changeModelInputs}
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="documentos">
                              Documentos do imóvel
                            </Label>
                            <Input
                              id="documentos"
                              type="file"
                              name="documentos"
                              multiple
                              onChange={handleDocumentos}
                              accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xlsm,.xls,.txt"
                            />
                          </div>
                          <div className="space-y-1">
                            {model.documentos &&
                              model.documentos.length > 0 &&
                              Object.values(model.documentos).map(
                                (documento, index) => (
                                  <div
                                    className="w-full flex justify-between gap-2 items-center"
                                    key={index}
                                  >
                                    <Input
                                      className=" w-2/3"
                                      id="documents"
                                      type="text"
                                      name="documents"
                                      onChange={(e) =>
                                        handleNameChange(index, e.target.value)
                                      }
                                    />
                                    <span className="text-xs truncate w-1/3">
                                      {documento.name}
                                    </span>
                                  </div>
                                )
                              )}
                            {model.documentos &&
                              model.documentos.length > 0 && (
                                <div className="flex justify-center mt-4">
                                  <Button
                                    size="sm"
                                    type="button"
                                    onClick={renameDocuments}
                                    variant={
                                      saveDocument ? "destructive" : "default"
                                    }
                                    className={`w-[150px]  `}
                                  >
                                    {saveDocument ? "Voltar" : "Salvar"}
                                  </Button>
                                </div>
                              )}
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="imagens">Imagens do imóvel</Label>
                            <Input
                              id="imagens"
                              type="file"
                              multiple
                              name="imagens"
                              onChange={changeModelFile}
                              accept=".png,.jpg,.jpeg"
                            />
                          </div>
                          <div className="w-full flex justify-end ">
                            <Button
                              type="button"
                              className="flex gap-1 justify-center"
                              size="sm"
                              onClick={createModel}
                            >
                              <Plus size={14} />
                              Novo modelo
                            </Button>
                          </div>
                        </CardContent>
                      </ScrollArea>
                    )}

                    {viewMode && (
                      <ScrollArea className="h-[400px] w-full">
                        <CardContent className="space-y-2">
                          <div className="w-full flex justify-between items-center mb-6">
                            <span>Modelos criados</span>{" "}
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              onClick={() => setViewMode(false)}
                              className="px-3"
                            >
                              <IterationCw size={16} />
                            </Button>
                          </div>
                          {modelos.length === 0 && (
                            <span>Não existem modelos criados</span>
                          )}
                          {modelos.map((modelo, index) => {
                            return (
                              <div
                                className="w-full flex justify-between items-center"
                                key={index}
                              >
                                <span>
                                  {selectedType === "apartamento"
                                    ? "Apartamento " + modelo.numeroApto
                                    : "Modelo " + (index + 1)}{" "}
                                </span>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  className="flex justify-center gap-2"
                                  size="sm"
                                  onClick={() => apagarModelo(index)}
                                >
                                  Apagar <Trash size={14} />
                                </Button>
                              </div>
                            );
                          })}
                        </CardContent>
                      </ScrollArea>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>

              <LargeDialogFooter className="flex justify-end w-full mt-3">
                <LargeDialogClose
                  onClick={handleResetFields}
                  type="button"
                  className="flex items-center justify-center gap-1 bg-destructive px-3 rounded-md text-white"
                >
                  <X size={16} /> Cancelar
                </LargeDialogClose>
                {modelos.length > 0 && (
                  <Button
                    type="submit"
                    className="flex justify-center items-center gap-1 "
                    disabled={loading}
                  >
                    <Plus size={16} />
                    {!loading && " Novo empreendimento"}
                    {loading && "Cadastrando..."}
                  </Button>
                )}
              </LargeDialogFooter>
            </form>
          </Form>
        </LargeDialogContent>
      </LargeDialog>
    );
}

export default NewNegotiationDialog;
