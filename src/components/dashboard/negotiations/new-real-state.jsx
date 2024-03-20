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
import {
  Eye,
  IterationCw,
  Plus,
  PlusCircle,
  Trash,
  X,
  XCircle,
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

function NewNegotiationDialog() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const form = useForm();

  const [cep, setCep] = useState("");
  const [numeroApto, setNumeroApto] = useState(0);
  const [address, setAddress] = useState({});
  const [loadingCep, setLoadingCep] = useState(false);
  const [type, setType] = useState("");
  const [modelos, setModelos] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [newNames, setNewNames] = useState({});
  const [documentos, setDocumentos] = useState([]);

  const { toast } = useToast();
  const [model, setModel] = useState({
    id: v4(),
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

  const { create, loading } = useData();
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

  const handleDocumentos = (event) => {
    const fileList = event.target.files;
    const newArquivos = Array.from(fileList).map((file) => file);
    setDocumentos([...documentos, ...newArquivos]);
    setModel({
      ...model,
      documentos: [...documentos, ...newArquivos],
    });
    console.log({
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

  function renameDocuments() {
    if (!newNames || typeof newNames !== "object" || Array.isArray(newNames)) {
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

    console.log(model.documentos);
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

  function formatarMoeda(valor) {
    const formated = parseFloat(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return formated;
  }
  const handleResetFields = () => {
    reset();
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
        console.log("Criando empreendimento...");
        console.log("Modelos:");
        console.log(modelos);
        await create(data, modelos);

        reset();
        setModelos([]);
        return;
    }
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

    if (!model.type)
      errors.push("Por favor, selecione o tipo do empreendimento.");
    if (!model.quartos_simples)
      errors.push("Por favor, preencha a quantidade de quartos simples.");
    if (!model.suites) errors.push("Por favor, preencha o número de suítes.");
    if (!model.banheiros)
      errors.push("Por favor, preencha o número de banheiros.");
    if (!model.vagas) errors.push("Por favor, preencha o número de vagas.");
    if (!model.price) errors.push("Por favor, preencha o preço do imóvel.");
    if (!model.area_total)
      errors.push("Por favor, preencha a área total do imóvel.");
    if (!model.area_construida)
      errors.push("Por favor, preencha a área construída do imóvel.");
    if (model.type === "apartamento" && !model.numeroApto)
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

    setModelos([...modelos, model]);
    console.log(model);

    setModel({
      type: "",
      quartos_simples: "",
      suites: "",
      banheiros: "",
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
    <Dialog>
      <DialogTrigger className="h-9 px-3  border-none outline-none w-[220px] bg-blue-600 text-white shadow hover:bg-blue-500/90 rounded-md flex gap-1 justify-center items-center text-sm">
        <PlusCircle size={14} className="mr-1" />
        Novo empreendimento
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar empreendimento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-5 justify-center py-4"
          >
            <Tabs defaultValue="step-1" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="step-1">Dados iniciais </TabsTrigger>
                <TabsTrigger value="step-2">Endereço</TabsTrigger>
                <TabsTrigger value="step-3">Modelos</TabsTrigger>
                <TabsTrigger value="step-4">Chaves</TabsTrigger>
              </TabsList>
              <TabsContent value="step-1">
                <Card className="py-4">
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
                                <option
                                  className="cursor-pointer"
                                  value="makehome"
                                >
                                  Make Home
                                </option>
                                <option className="cursor-pointer" value="mdk">
                                  MDK Construtora
                                </option>
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
                            >
                              <option className="cursor-pointer" value="">
                                Tipo do empreendimento
                              </option>
                              <option className="cursor-pointer" value="casa">
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
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="step-2">
                <ScrollArea className="h-[300px] w-full">
                  <Card className="py-4">
                    <CardContent className="space-y-2">
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
                  </Card>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="step-3">
                <ScrollArea className="h-[300px] w-full">
                  <Card className="py-4">
                    {!viewMode && (
                      <CardContent className="space-y-2">
                        <div className="w-full flex gap-2 items-center justify-between mb-3">
                          <span className="text-sm">
                            Criando um modelo de imóvel
                          </span>
                          <Button
                            size="sm"
                            onClick={() => setViewMode(true)}
                            className=" flex px-3  gap-1 justify-around text-sm"
                          >
                            <Eye size={14} /> Ver modelos
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="empresa">
                            Tipo do empreendimento
                          </Label>
                          <Select
                            onValueChange={changeModelType}
                            value={model.type}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  type.charAt(0).toUpperCase() + type.slice(1)
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartamento">
                                Apartamento
                              </SelectItem>
                              <SelectItem value="casa">Casa</SelectItem>
                              <SelectItem value="residencial">
                                Residencial
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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

                        <div className="w-full flex gap-2">
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
                        </div>

                        <div className="w-full flex gap-2">
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
                        </div>
                        <div className="w-full flex gap-2">
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
                        </div>
                        {model.type === "apartamento" && (
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
                          {model.documentos && (
                            <div className="  flex justify-center">
                              <Button
                                size="sm"
                                type="button"
                                onClick={renameDocuments}
                                className="w-[100px] mt-3"
                              >
                                Salvar
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
                    )}

                    {viewMode && (
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
                              <span>{modelo["area_construida"]}m²</span>
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
                    )}
                  </Card>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="step-4">
                <Card className="py-4">
                  <CardContent className="space-y-2">
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-end w-full mt-3">
              <DialogClose
                onClick={handleResetFields}
                type="button"
                className="flex items-center justify-center gap-1 bg-destructive px-3 rounded-md text-white"
              >
                <X size={16} /> Cancelar
              </DialogClose>
              <Button
                type="submit"
                className="flex justify-center items-center gap-1 "
                disabled={loading}
              >
                <Plus size={16} />
                {!loading && " Novo empreendimento"}
                {loading && "Cadastrando..."}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default NewNegotiationDialog;
