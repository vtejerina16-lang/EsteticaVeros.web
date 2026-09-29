type Props = {
  title: string;
  value: string;
  hint?: string;
  icon?: string;
};

export function MetricCard({ title, value, hint, icon }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-rose-100/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:shadow-md cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-neutral-500 transition-colors group-hover:text-rose-600">
            {title}
          </p>
          <p className="mt-1 text-2xl font-black text-neutral-900 tracking-tight">
            {value}
          </p>
          {hint ? (
            <p className="mt-1.5 text-xs text-neutral-500 font-medium">
              {hint}
            </p>
          ) : null}
        </div>

        {icon ? (
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-rose-100 bg-rose-50/60 text-xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-rose-100/70">
            <span aria-hidden>{icon}</span>
          </div>
        ) : null}
      </div>

      {/* Línea decorativa que se ilumina abajo al hacer hover */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-rose-400 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}