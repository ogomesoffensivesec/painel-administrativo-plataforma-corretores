"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { uuidv4 } from "@firebase/util";
import { createBuild } from "../_components/actions";
import { auth } from "@/database/config/firebase";

const states = [
  { name: "Acre", code: "AC" },
  { name: "Alagoas", code: "AL" },
  // Adicione todos os estados aqui
  { name: "São Paulo", code: "SP" },
  { name: "Rio de Janeiro", code: "RJ" },
];

export default function CriarObra() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    client: "",
    service: "",
    price: "",
    manager: "",
    base: "",
    totalArea: "",
    builtArea: "",
    pricePerSqm: "",
    startDate: "",
    endDate: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    documents: [],
    photos: [],
  });

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleZipChange = async (e) => {
    const zip = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      zip,
    }));

    if (zip.length === 8) {
      const response = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData((prevData) => ({
          ...prevData,
          address: data.logradouro,
          city: data.localidade,
          state: data.uf,
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files,
    }));
  };

  const handleImagePreview = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      photos: files,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      { key: "client", label: "Cliente" },
      { key: "service", label: "Serviço" },
      { key: "price", label: "Preço da Empreita" },
      { key: "manager", label: "Gerente" },
      { key: "base", label: "Base" },
      { key: "totalArea", label: "Área Total" },
      { key: "builtArea", label: "Área Construída" },
      { key: "pricePerSqm", label: "Valor por m²" },
      { key: "startDate", label: "Data de Início" },
      { key: "endDate", label: "Data de Fim" },
      { key: "address", label: "Endereço" },
      { key: "city", label: "Cidade" },
      { key: "state", label: "Estado" },
      { key: "zip", label: "CEP" },
      { key: "documents", label: "Documentos" },
      { key: "photos", label: "Fotos" },
    ];

    for (const field of requiredFields) {
      if (
        !formData[field.key] ||
        (Array.isArray(formData[field.key]) && formData[field.key].length === 0)
      ) {
        toast({
          title: "Todos os campos são obrigatórios",
          description: `Por favor, preencha o campo "${field.label}".`,
          variant: "destructive",
        });
        return;
      }
    }
    const userId = auth?.currentUser?.uid;
    const build = {
      ...formData,
      id: uuidv4(),
      createdAt: new Date(),
      userId,
    };

    // Se todos os campos estiverem preenchidos, prossiga com o envio
    const response = await createBuild(build);
    if (response) {
      console.log(response);
      toast({
        title: "Ocorreu um erro! Tente novamente",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Obra criada com sucesso!",
      variant: "success",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cadastro de Obra</h1>
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${
                currentStep >= 1 ? "bg-primary" : "bg-muted"
              }`}
            />
            <div
              className={`h-2 w-2 rounded-full ${
                currentStep >= 2 ? "bg-primary" : "bg-muted"
              }`}
            />
            <div
              className={`h-2 w-2 rounded-full ${
                currentStep >= 3 ? "bg-primary" : "bg-muted"
              }`}
            />
            <div
              className={`h-2 w-2 rounded-full ${
                currentStep >= 4 ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>
        </div>
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Label htmlFor="client">Cliente</Label>
                <Input
                  id="client"
                  name="client"
                  type="text"
                  value={formData.client}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="service">Serviço</Label>
                <Input
                  id="service"
                  name="service"
                  type="text"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="price">Preço da Empreita</Label>
                <Input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="manager">Gerente</Label>
                <Input
                  id="manager"
                  name="manager"
                  type="text"
                  value={formData.manager}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="base">Base</Label>
                <Input
                  id="base"
                  name="base"
                  type="text"
                  value={formData.base}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="totalArea">Área Total</Label>
                <Input
                  id="totalArea"
                  name="totalArea"
                  type="text"
                  value={formData.totalArea}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="builtArea">Área Construída</Label>
                <Input
                  id="builtArea"
                  name="builtArea"
                  type="text"
                  value={formData.builtArea}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="pricePerSqm">Valor por m²</Label>
                <Input
                  id="pricePerSqm"
                  name="pricePerSqm"
                  type="text"
                  value={formData.pricePerSqm}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleNext}>Próximo</Button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="state">Estado</Label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Selecione um estado</option>
                  {states.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="zip">CEP</Label>
                <Input
                  id="zip"
                  name="zip"
                  type="text"
                  value={formData.zip}
                  onChange={handleZipChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrev}>
                Anterior
              </Button>
              <Button onClick={handleNext}>Próximo</Button>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Label htmlFor="documents">
                  Documentos (PDF, planilhas, Word)
                </Label>
                <Input
                  id="documents"
                  name="documents"
                  type="file"
                  accept=".pdf,.xls,.xlsx,.doc,.docx"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button onClick={handlePrev}>Anterior</Button>
              <Button onClick={handleNext}>Próximo</Button>
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Label htmlFor="photos">Fotos</Label>
                <Input
                  id="photos"
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagePreview}
                />
              </div>
            </div>
            <div className="sm:col-span-6">
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <Button onClick={handlePrev}>Anterior</Button>
              <Button onClick={handleSubmit}>Enviar</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
