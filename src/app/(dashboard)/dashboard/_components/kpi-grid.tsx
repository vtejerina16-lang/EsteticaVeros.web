import { MetricCard } from "./metric-card";

type Item = { title: string; value: string; hint?: string; icon?: string };

export function KpiGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((it) => (
        <MetricCard key={it.title} title={it.title} value={it.value} hint={it.hint} icon={it.icon} />
      ))}
    </div>
  );
}