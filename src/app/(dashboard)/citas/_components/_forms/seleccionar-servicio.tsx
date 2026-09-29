export function SeleccionarServicio({ value, onChange, services = [] }: any) {
  const safeServices = Array.isArray(services) ? services : [];

  return (
    <div>
      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
        Servicio
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
      >
        <option value="" disabled>Selecciona un servicio...</option>
        {safeServices.map((s: any) => (
          <option key={s.id} value={s.id}>
            {s.name} {s.durationMin ? `(${s.durationMin} min)` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}