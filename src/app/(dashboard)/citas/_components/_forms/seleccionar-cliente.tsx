export function SeleccionarCliente({ value, onChange, clients = [] }: any) {
  // Forzamos que siempre sea un array para evitar errores de .map
  const safeClients = Array.isArray(clients) ? clients : [];

  return (
    <div>
      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
        Cliente
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
      >
        <option value="" disabled>Selecciona un cliente...</option>
        {safeClients.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.name} {c.phone ? `(${c.phone})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}