import { toast } from "@/components/ui/use-toast";


export const sendMessage = async (phone) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("token", "bbsi8z7rwlhp520t");
  urlencoded.append("to", `+55${phone}`);
  urlencoded.append("body", "BOT MAKE-HOME: Sua visita ao imóvel está chegando ao fim! Notifique a construtora.");

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  try {
    const response = await fetch("https://api.ultramsg.com/instance81611/messages/chat", requestOptions);
    const result = await response.text();
    console.log(result);
    if (result) {
      console.log(result.sent);

      toast({
        title: 'Lembrete enviado ao corretor!',
        description: 'Uma mensagem foi enviada ao corretor!',
        variant: 'warning'
      })
    }
  } catch (error) {
    console.log('error', error);
  }
};

