export function CashKpis({ totals, initial }: any) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-xs font-medium text-neutral-500">Monto Inicial</p>
        <p className="text-2xl font-bold text-neutral-900">{Number(initial).toFixed(2)} Bs</p>
      </div>
      <div className="rounded-xl border bg-white p-4 shadow-sm border-l-4 border-l-green-500">
        <p className="text-xs font-medium text-neutral-500">Ventas / Ingresos (+)</p>
        <p className="text-2xl font-bold text-green-600">+{totals.in.toFixed(2)} Bs</p>
      </div>
      <div className="rounded-xl border bg-white p-4 shadow-sm border-l-4 border-l-rose-500">
        <p className="text-xs font-medium text-neutral-500">Gastos / Egresos (-)</p>
        <p className="text-2xl font-bold text-rose-600">-{totals.out.toFixed(2)} Bs</p>
      </div>
    </div>
  );
}