import type { ServiceType } from "../_constants/services-enums";
import { typeLabel } from "../_constants/services-enums";

export function ServiceTypeBadge({ type }: { type: ServiceType }) {
  return <span className="text-sm text-neutral-700">{typeLabel(type)}</span>;
}