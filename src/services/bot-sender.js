import { toast } from "@/components/ui/use-toast";


export const sendMessageBot = async (phone, createdAt, user, issueType) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("token", process.env.whatsappKey);
  urlencoded.append("to", `+55${phone}`);
  urlencoded.append("body", `🤖 - Novo chamado\n\n*Criado em: ${createdAt}*\n*Usuário ${user}*\n*Tipo do chamado: ${issueType}*\n`);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  try {
    const response = await fetch("https://api.ultramsg.com/instance81611/messages/chat", requestOptions);
    const result = await response.text();
    if (result) {
      console.log(result.sent);

      toast({
        title: 'Lembrete enviado ao corretor!',
        description: 'Uma mensagem foi enviada ao corretor!',
        variant: 'warning'
      })
    }
  } catch (error) {
    console.error(error.message);
  }
};

