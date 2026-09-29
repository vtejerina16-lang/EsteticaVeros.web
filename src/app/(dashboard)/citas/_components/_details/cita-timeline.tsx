import type { Cita } from "../../_types";

type Item = {
  at: string; // ISO local
  title: string;
  desc?: string;
};

function toLabel(iso: string) {
  // iso: YYYY-MM-DDTHH:mm
  const d = new Date(iso);
  return d.toLocaleString("es-BO", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function statusLabel(s: Cita["status"]) {
  return s;
}

function channelLabel(c: Cita["channel"]) {
  switch (c) {
    case "whatsapp":
      return "WhatsApp";
    case "phone":
      return "Teléfono";
    case "walk_in":
      return "Presencial";
    case "instagram":
      return "Instagram";
    case "web":
      return "Web";
    default:
      return c;
  }
}

export function CitaTimeline({ cita }: { cita: Cita }) {
  const items: Item[] = [
    {
      at: cita.createdAt,
      title: "Cita creada",
      desc: `Canal: ${channelLabel(cita.channel)} · Estado: ${statusLabel(cita.status)}`,
    },
    {
      at: cita.startAt,
      title: "Inicio programado",
      desc: `${cita.client.name} · ${cita.service.name} · ${cita.professional?.name ?? "-"}`,
    },
    {
      at: cita.endAt,
      title: "Fin programado",
      desc: `Duración: ${cita.service.durationMin} min`,
    },
  ];

  // si updatedAt es distinto a createdAt, agregamos evento
  if (cita.updatedAt && cita.updatedAt !== cita.createdAt) {
    items.push({
      at: cita.updatedAt,
      title: "Última actualización",
      desc: "Se modificaron datos de la cita.",
    });
  }

  items.sort((a, b) => (a.at < b.at ? -1 : 1));

  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
      <p className="text-xs font-semibold text-rose-600">Historial</p>
      <h2 className="text-sm font-extrabold text-neutral-900">Timeline</h2>

      <div className="mt-4 space-y-3">
        {items.map((it, idx) => (
          <div key={`${it.at}-${idx}`} className="flex gap-3">
            <div className="mt-1 flex flex-col items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
              {idx < items.length - 1 ? <span className="mt-2 h-full w-px bg-rose-100" /> : null}
            </div>

            <div className="flex-1 rounded-2xl border border-rose-100 bg-rose-50/40 p-3">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div className="text-sm font-extrabold text-neutral-900">{it.title}</div>
                <div className="text-xs font-semibold text-neutral-600">{toLabel(it.at)}</div>
              </div>
              {it.desc ? <div className="mt-1 text-xs text-neutral-700">{it.desc}</div> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
