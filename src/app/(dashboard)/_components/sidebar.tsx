"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { isAdmin: boolean };

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({ isAdmin }: Props) {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Resumen", icon: "🏠" },
    { href: "/clientes", label: "Clientes", icon: "👤" },
    { href: "/citas", label: "Reservas", icon: "📅" },
    { href: "/servicios", label: "Servicios", icon: "💅" },
    { href: "/pagos", label: "Cobros", icon: "💳" },
    { href: "/caja", label: "Caja", icon: "🧾" },
    { href: "/reportes", label: "Reportes", icon: "📈" },
    ...(isAdmin ? [{ href: "/usuarios", label: "Usuarios", icon: "🛡️" }] : []),
    { href: "/perfil", label: "Perfil", icon: "👩‍💼" },
  ];

  return (
    <aside className="hidden w-[270px] shrink-0 lg:block">
      <div className="sticky top-6 space-y-4">
        <div className="rounded-[28px] border border-rose-100 bg-white/80 p-5 shadow-xs backdrop-blur-md transition-all">
          
          {/* LOGO DE CABECERA */}
          <div className="group flex items-center gap-3 cursor-pointer">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-100 text-rose-700 shadow-2xs transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105">
              ✿
            </div>
            <div>
              <p className="text-sm font-extrabold text-neutral-900 leading-tight">
                Estética Vero’s
              </p>
              <p className="text-xs font-medium text-neutral-400">
                Panel administrativo
              </p>
            </div>
          </div>

          {/* LISTA DE NAVEGACIÓN */}
          <nav className="mt-6 space-y-1.5">
            {items.map((it) => {
              const active = isActive(pathname, it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cx(
                    "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ease-out",
                    active
                      ? "bg-rose-500 text-white shadow-md shadow-rose-200/60"
                      : "text-neutral-700 hover:bg-rose-50/80 hover:text-rose-700 hover:translate-x-1"
                  )}
                >
                  {/* Contenedor del Icono */}
                  <span
                    className={cx(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-xl text-base transition-all duration-200",
                      active
                        ? "bg-white/20 text-white"
                        : "border border-rose-100 bg-white group-hover:border-rose-200 group-hover:scale-110 group-hover:shadow-2xs"
                    )}
                  >
                    {it.icon}
                  </span>

                  {/* Texto de la opción */}
                  <span className="flex-1">{it.label}</span>

                  {/* Indicador para la opción activa */}
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}