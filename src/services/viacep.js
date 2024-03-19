import { toast } from "@/components/ui/use-toast";

export async function fetchCep(cep) {
  try {
    const data = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const address = await data.json()
    return address

  } catch (error) {
    toast({
      title: "Cep não encontrado",
      description: "Preencha os dados manualmente!",
      variant: "destructive",
    });
    return error
  }
}