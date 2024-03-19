"use client";

import { FormField, FormItem } from "@/components/ui/form";
import { validateDocument, validatePhoneNumber } from "@/validators/regex";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ClientImage from "../../../../assets/client-form.png";

function ClientForm() {
  const form = useForm();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    form.trigger().then((isValid) => {
      if (isValid) {
        console.log("Form data:", data);
        setSteps(steps + 1);
      } else {
        console.log("Form validation failed. Please check the fields.");
      }
    });
  };
  const [isClient, setIsClient] = useState(false);
  const [clientType, setClientType] = useState("");
  const [steps, setSteps] = useState(1);
  const [cep, setCep] = useState("");

  const handleClientTypeChange = (e) => {
    setClientType(e.target.value);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <div className="w-[850px] h-[500px] lg:w-[1000px] lg:h-[600px] rounded-2xl bg-white shadow-xl border-[1px] border-blue-500 flex overflow-hidden">
          <div className="w-1/2 h-full flex items-center justify-center p-4 ">
            <Image
              src={ClientImage}
              alt="client-form"
              width={450}
              height={"auto"}
              className="rounded-3xl"
            />
          </div>
          <div className="w-1/2 h-full flex flex-col items-center p-10">
            <div className="w-full text-right mt-4">
              <span className="font-bold text-xl text-stone-800 ">
                Cadastre seu cliente
              </span>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col pt-2 pb-0 w-full px-2 space-y-3 h-full "
            >
              {steps === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <select
                          value={clientType}
                          onChange={handleClientTypeChange}
                          className="bg-gray-50 border border-blue-600 text-stone-700 text-sm rounded-sm focus:ring-stone-500 focus:border-stone-500 block w-full p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-stone-500 dark:focus:border-stone-500"
                        >
                          <option className="cursor-pointer" value="">
                            Física ou Jurídica
                          </option>
                          <option className="cursor-pointer" value="fisica">
                            Pessoa Física
                          </option>
                          <option className="cursor-pointer" value="juridica">
                            Pessoa Jurídica
                          </option>
                        </select>
                      </FormItem>
                    )}
                  />
                  {clientType === "juridica" && (
                    <>
                      <div className="w-full flex flex-col p-0 ">
                        <input
                          placeholder="Razão Social"
                          className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                          type="text"
                          id="companyName"
                          aria-invalid={errors.companyName ? "true" : "false"}
                          {...register("companyName", { required: true })}
                        />
                        {errors.companyName && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0">
                        <Controller
                          name="document"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder="CNPJ"
                              className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                              id="document"
                              aria-invalid={errors.document ? "true" : "false"}
                            />
                          )}
                          rules={{
                            required: "CNPJ é obrigatório",
                            validate: validateDocument,
                          }}
                        />
                        {errors.document && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            {errors.document.message}
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0">
                        <input
                          placeholder="E-mail"
                          className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm "
                          type="email"
                          id="email"
                          aria-invalid={errors.email ? "true" : "false"}
                          {...register("email", { required: true })}
                        />
                        {errors.email && (
                          <span
                            role="alert"
                            className="text-right text-[11px] mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0">
                        <Controller
                          name="phoneNumber"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder="Número de telefone"
                              className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                              id="phoneNumber"
                              aria-invalid={
                                errors.phoneNumber ? "true" : "false"
                              }
                            />
                          )}
                          rules={{
                            required: "Número de telefone é obrigatório",
                            validate: validatePhoneNumber,
                          }}
                        />
                        {errors.phoneNumber && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            {errors.phoneNumber.message}
                          </span>
                        )}
                      </div>

                      <div className="w-full flex flex-col p-0 mb-4">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-900  text-right"
                          htmlFor="file_input"
                        >
                          Cartão CNPJ
                        </label>
                        <input
                          className="block w-full text-xs text-stone-900 border rounded-md border-blue-500 p-2  cursor-pointer bg-stone-50 dark:text-tone-400 focus:outline-none dark:bg-gray-tone700 dark:border-border-600 dark:placeholder-stone-400"
                          type="file"
                          accept=".pdf,.png,.jpeg,.jpg"
                          id="identidade"
                          aria-invalid={errors.identidade ? "true" : "false"}
                          {...register("identidade", { required: true })}
                        />
                        {errors.identidade && (
                          <span
                            role="alert"
                            className="text-right text-[11px] mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  {clientType === "fisica" && (
                    <>
                      <div className="w-full flex flex-col p-0 ">
                        <input
                          placeholder="Nome completo"
                          className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                          type="text"
                          id="fullName"
                          aria-invalid={errors.fullName ? "true" : "false"}
                          {...register("fullName", { required: true })}
                        />
                        {errors.fullName && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0">
                        <Controller
                          name="document"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder="CPF"
                              className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                              id="document"
                              aria-invalid={errors.document ? "true" : "false"}
                            />
                          )}
                          rules={{
                            required: "CPF é obrigatório",
                            validate: validateDocument,
                          }}
                        />
                        {errors.document && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            {errors.document.message}
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0">
                        <input
                          placeholder="E-mail"
                          className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm "
                          type="email"
                          id="email"
                          aria-invalid={errors.email ? "true" : "false"}
                          {...register("email", { required: true })}
                        />
                        {errors.email && (
                          <span
                            role="alert"
                            className="text-right text-[11px] mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0">
                        <Controller
                          name="phoneNumber"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder="Número de telefone"
                              className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                              id="phoneNumber"
                              aria-invalid={
                                errors.phoneNumber ? "true" : "false"
                              }
                            />
                          )}
                          rules={{
                            required: "Número de telefone é obrigatório",
                            validate: validatePhoneNumber,
                          }}
                        />
                        {errors.phoneNumber && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            {errors.phoneNumber.message}
                          </span>
                        )}
                      </div>

                      <div className="w-full flex flex-col p-0 mb-4">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-900  text-right"
                          htmlFor="file_input"
                        >
                          Documento de identidade
                        </label>
                        <input
                          className="block w-full text-xs text-stone-900 border rounded-md border-blue-500 p-2  cursor-pointer bg-stone-50 dark:text-tone-400 focus:outline-none dark:bg-gray-tone700 dark:border-border-600 dark:placeholder-stone-400"
                          type="file"
                          accept=".pdf,.png,.jpeg,.jpg"
                          id="identidade"
                          aria-invalid={errors.identidade ? "true" : "false"}
                          {...register("identidade", { required: true })}
                        />
                        {errors.identidade && (
                          <span
                            role="alert"
                            className="text-right text-[11px] mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {clientType != "" && (
                    <div className="flex-1 pt-4 flex justify-center items-center">
                      <button
                        type="submit"
                        disabled={steps === 0}
                        className="w-[220px] py-1.5 flex justify-center items-center gap-3 px-2 text-center mx-auto bg-blue-500 text-white  text-sm  font-medium rounded-md shadow-sm transition-all duration-300 hover:bg-stone-500  "
                      >
                        Continuar <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
              {steps === 2 && (
                <>
                  {clientType === "juridica" && (
                    <>
                      <div className="w-full flex flex-col p-0 ">
                        <input
                          placeholder="Razão Social"
                          className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                          type="text"
                          id="companyName"
                          aria-invalid={errors.companyName ? "true" : "false"}
                          {...register("companyName", { required: true })}
                        />
                        {errors.companyName && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0">
                        <Controller
                          name="document"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder="CNPJ"
                              className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                              id="document"
                              aria-invalid={errors.document ? "true" : "false"}
                            />
                          )}
                          rules={{
                            required: "CNPJ é obrigatório",
                            validate: validateDocument,
                          }}
                        />
                        {errors.document && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            {errors.document.message}
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0">
                        <input
                          placeholder="E-mail"
                          className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm "
                          type="email"
                          id="email"
                          aria-invalid={errors.email ? "true" : "false"}
                          {...register("email", { required: true })}
                        />
                        {errors.email && (
                          <span
                            role="alert"
                            className="text-right text-[11px] mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0">
                        <Controller
                          name="phoneNumber"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder="Número de telefone"
                              className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                              id="phoneNumber"
                              aria-invalid={
                                errors.phoneNumber ? "true" : "false"
                              }
                            />
                          )}
                          rules={{
                            required: "Número de telefone é obrigatório",
                            validate: validatePhoneNumber,
                          }}
                        />
                        {errors.phoneNumber && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            {errors.phoneNumber.message}
                          </span>
                        )}
                      </div>

                      <div className="w-full flex flex-col p-0 mb-4">
                        <label
                          className="block mb-1 text-sm font-medium text-gray-900  text-right"
                          htmlFor="file_input"
                        >
                          Cartão CNPJ
                        </label>
                        <input
                          className="block w-full text-xs text-stone-900 border rounded-md border-blue-500 p-2  cursor-pointer bg-stone-50 dark:text-tone-400 focus:outline-none dark:bg-gray-tone700 dark:border-border-600 dark:placeholder-stone-400"
                          type="file"
                          accept=".pdf,.png,.jpeg,.jpg"
                          id="identidade"
                          aria-invalid={errors.identidade ? "true" : "false"}
                          {...register("identidade", { required: true })}
                        />
                        {errors.identidade && (
                          <span
                            role="alert"
                            className="text-right text-[11px] mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  {clientType === "fisica" && (
                    <>
                      <div className="w-full flex flex-col p-0 ">
                        <div className="w-full flex justify-between">
                          <input
                            placeholder="CEP"
                            className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                            type="text"
                            id="cep"
                            onChange={(e) => setCep(e.target.value)}
                            defaultValue={cep}
                          />
                        </div>
                        {errors.streetNumber && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>

                      <div className="w-full flex flex-col p-0 ">
                        <input
                          placeholder="Rua"
                          className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                          type="text"
                          id="street"
                          aria-invalid={errors.street ? "true" : "false"}
                          {...register("street", { required: true })}
                        />
                        {errors.street && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0 ">
                        <input
                          placeholder="Número"
                          className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                          type="number"
                          id="number"
                          aria-invalid={errors.number ? "true" : "false"}
                          {...register("number", { required: true })}
                        />
                        {errors.number && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>

                      <div className="w-full flex flex-col p-0 ">
                        <input
                          placeholder="Bairro"
                          className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                          type="text"
                          id="neighborhood"
                          aria-invalid={errors.neighborhood ? "true" : "false"}
                          {...register("neighborhood", { required: true })}
                        />
                        {errors.neighborhood && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0 ">
                        <input
                          placeholder="Cidade"
                          className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                          type="text"
                          id="city"
                          aria-invalid={errors.city ? "true" : "false"}
                          {...register("city", { required: true })}
                        />
                        {errors.city && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col p-0 ">
                        <input
                          placeholder="Estado"
                          className="w-full border-[1px] border-blue-500 p-2 rounded-sm shadow outline-none focus:outline-none text-sm"
                          type="text"
                          id="state"
                          aria-invalid={errors.state ? "true" : "false"}
                          {...register("state", { required: true })}
                        />
                        {errors.state && (
                          <span
                            role="alert"
                            className="text-right  text-[11px]  mt-1 text-red-600"
                          >
                            Obrigatório!
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {clientType != "" && (
                    <div className="flex-1 pt-4 flex justify-center items-center">
                      <button
                        type="submit"
                        disabled={steps === 0}
                        className="w-[220px] py-1.5 flex justify-center items-center gap-3 px-2 text-center mx-auto bg-blue-500 text-white  text-sm  font-medium rounded-md shadow-sm transition-all duration-300 hover:bg-stone-500  "
                      >
                        Cadastrar <Plus size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ClientForm;
