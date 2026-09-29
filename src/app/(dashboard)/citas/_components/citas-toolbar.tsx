import Link from "next/link";
import { CitasTabs } from "./citas-tabs";

export function CitasToolbar({ view }: { view: "list" | "calendar" }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold text-rose-600">Agenda</p>
        <h1 className="text-xl font-extrabold text-neutral-900">Citas</h1>
      </div>

      <div className="flex items-center gap-3">
        <CitasTabs view={view} />
        <Link href="/citas/nuevo" className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
          Nueva cita
        </Link>
      </div>
    </div>
  );
}