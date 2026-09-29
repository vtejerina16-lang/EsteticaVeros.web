import type { CitaStatus } from "../_types";

// 🚩 Sincronizado con los strings exactos que vimos en tus capturas de API
const MAP: Record<string, { label: string; cls: string }> = {
  "Pendiente": { 
    label: "Pendiente", 
    cls: "bg-amber-50 text-amber-700 border-amber-200" 
  },
  "Confirmada": { 
    label: "Confirmada", 
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200" 
  },
  "Cliente llegó": { 
    label: "En Espera", 
    cls: "bg-purple-50 text-purple-700 border-purple-200" 
  },
  "En progreso": { 
    label: "Atendiendo", 
    cls: "bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse" 
  },
  "Completada": { 
    label: "Finalizada", 
    cls: "bg-sky-50 text-sky-700 border-sky-200" 
  },
  "Cancelada": { 
    label: "Cancelada", 
    cls: "bg-rose-50 text-rose-700 border-rose-200" 
  },
  "No Show": { 
    label: "No asistió", 
    cls: "bg-neutral-100 text-neutral-700 border-neutral-200" 
  },
};

export function CitaStatusBadge({ status }: { status: string }) {
  // Usamos el status que llega del backend, si no existe en el MAP, mostramos un estilo gris
  const x = MAP[status] || { 
    label: status || "Desconocido", 
    cls: "bg-gray-50 text-gray-600 border-gray-200" 
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold shadow-sm ${x.cls}`}>
      {/* Un pequeño punto decorativo para que se vea más pro */}
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-60"></span>
      {x.label}
    </span>
  );
}