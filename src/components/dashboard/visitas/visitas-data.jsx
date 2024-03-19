import { toast } from "@/components/ui/use-toast";
import { database } from "@/database/config/firebase";
import { get, ref, remove, set } from "firebase/database";
import { v4 } from "uuid";

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

export async function scheduleVisit(data) {
  try {
    const {
      realState,
      scheduled_day,
      scheduled_month,
      scheduled_hour,
      corretor,
    } = data;
    const realStateJSON = JSON.parse(realState);
    const corretorJSON = JSON.parse(corretor);
    const visitId = v4();
    const scheduledDate = `${scheduled_day}/${scheduled_month}/2024`;
    const createdAt = new Date().toISOString();
    const visit = {
      realState: realStateJSON,
      scheduled_date: scheduledDate,
      scheduled_hour,
      status: "Aguardando retirada de chaves",
      id: visitId,
      corretor: corretorJSON,
      createdAt: createdAt,
    };

    const referenciaDatabase = ref(database, `/visitas/${visitId}`);
    await set(referenciaDatabase, visit);

    toast({
      title: "Visita agendada!",
      description:
        "Caso ocorra algum imprevisto, não esqueça de cancelar a visita!",
      variant: "success",
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    toast({
      title: "Erro ao cancelar visita!",
      description: "Tente novamente em alguns instantes.",
      variant: "destructive",
    });
  }
}
