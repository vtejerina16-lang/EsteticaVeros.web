import { statusLabel } from "../_constants/services-enums";

export function ServiceStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-700"}`}>
      {statusLabel(isActive)}
    </span>
  );
}