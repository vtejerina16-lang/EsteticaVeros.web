import type { AppointmentStatus } from "../_types/dashboard-types";

function label(status: AppointmentStatus) {
  switch (status) {
    case "scheduled":
      return "Programada";
    case "confirmed":
      return "Confirmada";
    case "completed":
      return "Completada";
    case "cancelled":
      return "Cancelada";
    case "no_show":
      return "No asistió";
  }
}

function classes(status: AppointmentStatus) {
  switch (status) {
    case "confirmed":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    case "completed":
      return "border-sky-100 bg-sky-50 text-sky-700";
    case "cancelled":
      return "border-rose-100 bg-rose-50 text-rose-700";
    case "no_show":
      return "border-amber-100 bg-amber-50 text-amber-700";
    case "scheduled":
    default:
      return "border-neutral-200 bg-neutral-50 text-neutral-700";
  }
}

export function StatusPill({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold ${classes(status)}`}>
      {label(status)}
    </span>
  );
}