import Link from "next/link";

const actions = [
  { href: "/citas/nuevo", title: "Nueva cita", desc: "Agendar rápidamente", icon: "➕" },
  { href: "/clientes/nuevo", title: "Nuevo cliente", desc: "Registrar datos", icon: "👤" },
  { href: "/pagos/nuevo", title: "Registrar pago", desc: "Cobros del día", icon: "💸" },
  { href: "/caja", title: "Caja", desc: "Apertura/cierre", icon: "🧾" },
  { href: "/reportes", title: "Reportes", desc: "Ingresos y servicios", icon: "📊" },
  
];

export function QuickActions() {
  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-semibold text-rose-600">Atajos</p>
      <h2 className="text-base font-extrabold text-neutral-900">Acciones rápidas</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group rounded-2xl border border-rose-100 bg-rose-50/40 p-3 hover:bg-rose-50"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-rose-100 bg-white text-lg">
                <span aria-hidden>{a.icon}</span>
              </div>
              <div>
                <p className="text-sm font-extrabold text-neutral-900 group-hover:text-rose-700">{a.title}</p>
                <p className="text-xs text-neutral-600">{a.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
