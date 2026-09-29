"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { patchCitaStatus } from "./../_actions/citas-actions";
import { toast } from "sonner";

interface Props {
  id: string;
  status: string;
  clientId?: string;
  clientName?: string;
  serviceId?: string;
  serviceName?: string;
  amount?: number;
  employeeId?: string;
}

type ActionType = "confirm" | "check-in" | "no-show" | "start" | "complete";

export function CitaRowActions({
  id,
  status,
  clientId,
  clientName,
  serviceId,
  serviceName,
  amount,
  employeeId,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const currentStatus = status?.toString().trim();

  const handleAction = (type: ActionType) => {
    startTransition(async () => {
      const result = await patchCitaStatus(id, type);
      if (result?.success) {
        toast.success("¡Hecho!", { description: "Estado actualizado correctamente." });
        router.refresh();
      } else {
        toast.error("Error", {
          description: result?.error || "Ocurrió un error al actualizar el estado.",
        });
      }
    });
  };

  const handleIrACobro = () => {
    const params = new URLSearchParams({ appointmentId: id });

    if (clientId) params.set("customerId", clientId);
    if (clientName) params.set("customerName", clientName);
    if (serviceId) params.set("serviceId", serviceId);
    if (serviceName) params.set("serviceName", serviceName);
    if (amount !== undefined && amount !== null) params.set("amount", amount.toString());
    if (employeeId) params.set("employeeId", employeeId);

    router.push(`/pagos/nuevo?${params.toString()}`);
  };

  const isNoShowEligible = ["Pendiente", "Confirmada", "Cliente llegó"].includes(currentStatus);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {/* Pendiente */}
      {currentStatus === "Pendiente" && (
        <button
          onClick={() => handleAction("confirm")}
          disabled={isPending}
          className="rounded px-2 py-1 text-[11px] font-bold uppercase text-emerald-600 transition-all hover:bg-emerald-50 disabled:opacity-50"
        >
          {isPending ? "..." : "Confirmar"}
        </button>
      )}

      {/* Confirmada */}
      {currentStatus === "Confirmada" && (
        <button
          onClick={() => handleAction("check-in")}
          disabled={isPending}
          className="rounded-full bg-amber-500 px-4 py-1.5 text-[10px] font-bold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50"
        >
          {isPending ? "..." : "Marcar Llegada"}
        </button>
      )}

      {/* Cliente llegó */}
      {currentStatus === "Cliente llegó" && (
        <button
          onClick={() => handleAction("start")}
          disabled={isPending}
          className="rounded-full bg-indigo-600 px-4 py-1.5 text-[10px] font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPending ? "..." : "Iniciar"}
        </button>
      )}

      {/* En progreso */}
      {currentStatus === "En progreso" && (
        <>
          <button
            onClick={() => handleAction("complete")}
            disabled={isPending}
            className="animate-pulse rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-50"
          >
            {isPending ? "..." : "Finalizar"}
          </button>
          <button
            onClick={handleIrACobro}
            disabled={isPending}
            className="rounded-full bg-rose-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
          >
            Cobrar
          </button>
        </>
      )}

      {/* Cita completada */}
      {currentStatus === "Completada" && (
        <button
          onClick={handleIrACobro}
          disabled={isPending}
          className="rounded-full bg-rose-600 px-4 py-1.5 text-[10px] font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
        >
          Ir a Cobro 💳
        </button>
      )}

      {/* No asistió */}
      {isNoShowEligible && (
        <button
          onClick={() => handleAction("no-show")}
          disabled={isPending}
          className="ml-1 text-[10px] font-medium text-neutral-400 hover:text-rose-500 disabled:opacity-50"
        >
          No asistió
        </button>
      )}
    </div>
  );
}