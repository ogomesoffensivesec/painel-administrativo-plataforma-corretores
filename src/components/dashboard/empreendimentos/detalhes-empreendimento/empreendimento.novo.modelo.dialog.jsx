import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, LayoutDashboard, Plus } from "lucide-react";
import { useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import CurrencyInput from "react-currency-input-field";
import { useToast } from "@/components/ui/use-toast";
import useData from "@/hooks/useData";
import JSZip from "jszip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function NovoModelo() {
  const { novoModelo } = useData();
  const [model, setModel] = useState({});
  const [loading, setLoading] = useState(false);
  const [numeroApto, setNumeroApto] = useState(0);
  const [newNames, setNewNames] = useState({});
  const [documentos, setDocumentos] = useState([]);
  const { toast } = useToast();
  const [type, setType] = useState("");
  const [saveDocument, setSaveDocument] = useState(false);

  const handleNameChange = (documentoId, newName) => {
    setNewNames((prevNames) => ({
      ...prevNames,
      [documentoId]: newName,
    }));
  };

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

  function renameDocuments() {
    if (saveDocument) {
      setSaveDocument(false);
      return;
    }
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

  const createModel = async () => {
    const requiredFields = [
      "type",
      "quartos_simples",
      "suites",
      "banheiros",
      "vagas",
      "price",
      "area_total",
      "lavabos",
      "area_construida",
      "documentos",
      "imagens",
    ];

    const errors = [];

    requiredFields.forEach((field) => {
      switch (field) {
        case "type":
        case "quartos_simples":
        case "suites":
        case "banheiros":
        case "vagas":
        case "price":
        case "area_total":
        case "lavabos":
        case "area_construida":
          if (!model[field]) {
            errors.push(
              `Por favor, preencha o campo ${field.replace("_", " ")}.`
            );
          }
          break;
        case "documentos":
        case "imagens":
          if (!model[field] || model[field].length === 0) {
            errors.push(
              `Por favor, adicione pelo menos um ${
                field === "documentos" ? "documento" : "imagem"
              }.`
            );
          }
          break;
        default:
          break;
      }
    });

    if (model.type === "apartamento" && !model.numeroApto) {
      errors.push("Por favor, preencha o número do apartamento.");
    }

    if (errors.length > 0) {
      errors.forEach((error) =>
        toast({ title: error, variant: "destructive" })
      );
      return;
    }

    if (model.imagens.length > 0) {
      const fileImage = await createZipFolder(model.imagens);
      model.fileImage = fileImage;
    }

    if (model.documentos.length > 0) {
      const fileDocument = await createZipFolder(model.documentos);
      model.fileDocument = fileDocument;
    }

    try {
      setLoading(true);
      await novoModelo(model);

      setModel({});
      setDocumentos([]);
      setNewNames({});
    } catch (error) {
      toast({
        title: "Erro ao cadastrar novo modelo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="relative flex  w-full  cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 justify-between">
        Novo Modelo
        <LayoutDashboard size={16} className="text-blue-500" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo modelo</DialogTitle>
        </DialogHeader>
        <div className="w-full flex gap-2 items-center justify-center mt-2">
          <ScrollArea className="h-[300px] w-full">
            <Card className="py-4">
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="empresa">Tipo do empreendimento</Label>
                  <Select onValueChange={changeModelType} value={model.type}>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          type.charAt(0).toUpperCase() + type.slice(1)
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="residencial">Residencial</SelectItem>
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
                <div className="w-full flex items-center gap-4 ">
                  <Label htmlFor="suites">Lavabos</Label>
                  <Input
                    id="lavabos"
                    type="number"
                    name="lavabos"
                    value={model.lavabos}
                    onChange={changeModelInputs}
                  />
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
                    <Label htmlFor="area_construida">Área Construída</Label>
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
                    <Label htmlFor="numeroApto">Número do apartamento</Label>
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
                  <Label htmlFor="documentos">Documentos do imóvel</Label>
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
                    Object.values(model.documentos).map((documento, index) => (
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
                    ))}
                  {model.documentos && model.documentos.length > 0 && (
                    <div className="flex justify-center mt-4">
                      <Button
                        size="sm"
                        type="button"
                        onClick={renameDocuments}
                        variant={saveDocument ? "destructive" : "default"}
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
                    disabled={loading}
                    onClick={createModel}
                  >
                    <Plus size={14} />
                    {!loading ? " Novo modelo" : "Carregando..."}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NovoModelo;
