import { toast } from "@/components/ui/use-toast";
import { database } from "@/database/config/firebase";
import { sendMessage } from "@/services/whatsapp.bot";
import { get, ref, remove, set, update } from "firebase/database";

async function fetchVisits() {
  const referenciaDatabase = ref(database, "/visitas");
  const snapshot = await get(referenciaDatabase);
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
}

export async function getVisits(
  realState,
  scheduled_day,
  scheduled_month,
  scheduled_hour,
  finalizada
) {
  let visits = await fetchVisits();

  if (realState) {
    visits = visits.filter(
      (visit) =>
        visit.realState.nome.toLowerCase() === realState.nome ||
        visit.realState.nome.toLowerCase() === realState
    );
  }

  if (scheduled_day) {
    visits = visits.filter(
      (visit) => visit.scheduled_date.split("/")[0] === scheduled_day
    );
  }

  if (scheduled_month) {
    visits = visits.filter(
      (visit) => visit.scheduled_date.split("/")[1] === scheduled_month
    );
  }

  if (scheduled_hour) {
    const decodedScheduledHour = decodeURIComponent(scheduled_hour);
    const [filterHour, filterMinute] = decodedScheduledHour.split(":");
    const filterTime = parseInt(filterHour) * 60 + parseInt(filterMinute);
    const filterEndTime = filterTime + 120;

    visits = visits.filter((visit) => {
      const [visitHour, visitMinute] = visit.scheduled_hour.split(":");
      const visitTime = parseInt(visitHour) * 60 + parseInt(visitMinute);
      const visitEndTime = visitTime + 120;

      return filterTime >= visitTime && filterTime <= visitEndTime;
    });
  }

  if (finalizada === "yes") {
    visits = visits.filter((visit) => visit.finalizada);
  } else {
    visits = visits.filter((visit) => !visit.finalizada);
  }

  return visits;
}

export async function scheduleVisit(visitId, data) {
  try {
    const {
      realState,
      scheduled_day,
      scheduled_month,
      scheduled_hour,
      corretor,
    } = data;
    const realStateJSON = JSON.parse(realState);

    const scheduledDate = `${scheduled_day}/${scheduled_month}/2024`;
    const createdAt = new Date().toISOString();
    const visit = {
      realState: realStateJSON,
      scheduled_date: scheduledDate,
      scheduled_hour,
      status: "Aguardando retirada de chaves",
      id: visitId,
      corretor: corretor,
      createdAt: createdAt,
    };

    if (realStateJSON.chaves === 0) {
      toast({
        title: "Chaves sendo utilizadas",
        description: "Todas as chaves deste imóvel",
        variant: "destructive",
      });
      return;
    }
    const referenciaEmpreendimento = ref(
      database,
      `/empreendimentos/${realStateJSON.id}`
    );
    const updateKeys = parseInt(realStateJSON.chaves) - 1;
    const snap = await update(referenciaEmpreendimento, {
      chaves: updateKeys,
    });
    console.log(snap);
    const referenciaDatabase = ref(database, `/visitas/${visitId}`);
    await set(referenciaDatabase, visit);

    toast({
      title: "Visita agendada!",
      description:
        "Caso ocorra algum imprevisto, não esqueça de cancelar a visita!",
      variant: "success",
    });
  } catch (error) {
    console.error(error.message);
  }
}

export async function cancelVisit(visit, router) {
  const id = visit.id;
  const referencia = ref(database, `/visitas/${id}`);
  try {
    await remove(referencia);

    toast({
      title: "Visita cancelada!",
      description: `Sua visita ao imóvel ${visit.realState.nome}`,
      variant: "success",
    });
    return;
  } catch (error) {
    console.error(error.message);
    toast({
      title: "Erro ao cancelar visita!",
      description: "Tente novamente em alguns instantes.",
      variant: "destructive",
    });
  }
}
function formatDate(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  const data = day + "/" + month + "/" + year;
  const hour = hours + ":" + minutes;
  return { data, hour };
}

export async function visitInProgress(visit) {
  const referenciaVisitaPendente = ref(
    database,
    `/visitas-em-andamento/${visit.id}`
  );

  let currentDate = new Date();
  const { data, hour } = formatDate(currentDate);

  const visitaPendente = {
    id: visit.id,
    corretorID: visit.corretor,
    retiradaHora: hour,
    retiradaData: data,
    realState: visit.realState,
  };
  await set(referenciaVisitaPendente, visitaPendente);
  return;
}

function horaParaMilissegundos(tempo) {
  var partes = tempo.split(":");
  var horas = parseInt(partes[0], 10);
  var minutos = parseInt(partes[1], 10);

  // Converter horas e minutos em milissegundos
  var horasEmMilissegundos = horas * 60 * 60 * 1000;
  var minutosEmMilissegundos = minutos * 60 * 1000;

  // Somar horas e minutos convertidos para obter o total em milissegundos
  var totalEmMilissegundos = horasEmMilissegundos + minutosEmMilissegundos;

  return totalEmMilissegundos;
}

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

async function verificarVisitasExpiradas() {
  try {
    const referenciaVisitasemAndamento = ref(database, "/visitas-em-andamento");
    const referenciaCorretores = ref(database, "/corretores");

    const corretores_snapshot = await get(referenciaCorretores);

    const visitasPendentesSnapshot = await get(referenciaVisitasemAndamento);
    if (visitasPendentesSnapshot.exists() && corretores_snapshot.exists()) {
      const visitasPendentes = visitasPendentesSnapshot.val();
      const corretores = corretores_snapshot.val();
      const currentTime = getCurrentTime();

      Object.values(visitasPendentes).forEach((visita) => {
        const time = visita.retiradaHora;
        const timeNotPoint = time.replace(":", "");
        const retiradaExpirada = parseInt(timeNotPoint) + 1; //200 para duas horas
        const horaAtual = currentTime.replace(":", "");

        const corretor = Object.values(corretores).find(
          (corretor_pesquisado) => corretor_pesquisado.uid === visita.corretorID
        );

        if (retiradaExpirada <= horaAtual) {
          sendMessage(corretor.phone, corretor.name, visita.realState.nome);
          removerVisitaPendente(visita.id, true);
        }
      });
    }
  } catch (error) {
    console.error("Error in verificarVisitasExpiradas:", error);
  }
}

function executarVerificacaoDeVisitas() {
  verificarVisitasExpiradas();
  setInterval(verificarVisitasExpiradas, 10000);
}

executarVerificacaoDeVisitas();

export async function removerVisitaPendente(idVisita, expired) {
  try {
    const referenciaDatabase = ref(
      database,
      `/visitas-em-andamento/${idVisita}`
    );
    const referenciaVisitas = ref(database, `/visitas/${idVisita}/`);
    const snapshot = await get(referenciaVisitas);

    if (snapshot.exists() && expired) {
      const data = snapshot.val();
      let logs = data.log;
      const log = {
        action: "Tempo da visita expirada",
        date: new Date(),
      };
      logs.push(log);

      await update(referenciaVisitas, {
        log: logs,
        expired: true,
      });
    }

    await remove(referenciaDatabase);

    return;
  } catch (error) {
    console.error("Error in removerVisitaPendente:", error);
  }
}
