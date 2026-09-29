import type { ServiceComponent, ServicePickerItem } from "../../_types/services.types";

export function ServiceComponentsList({
  components,
  pickerItems,
}: {
  components: ServiceComponent[];
  pickerItems: ServicePickerItem[];
}) {
  if (!components.length) return null;

  const map = new Map(pickerItems.map((x) => [x.id, x.name]));
  const list = components.slice().sort((a, b) => a.order - b.order);

  return (
    <div className="mt-4 rounded-2xl border border-rose-100 p-4">
      <div className="text-sm font-semibold text-neutral-900">Componentes (incluye)</div>
      <ul className="mt-2 space-y-1 text-sm text-neutral-700">
        {list.map((c) => (
          <li key={c.serviceId} className="flex items-center justify-between">
            <span>{map.get(c.serviceId) ?? c.serviceId}</span>
            <span className="text-xs text-neutral-600">x{c.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}