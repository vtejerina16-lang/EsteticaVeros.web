"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/shared/actions/auth-actions";
import type { Me } from "../dashboard/_services/me-service";

function initials(name: string) {
const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
const a = parts[0]?.[0] ?? "U";
const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
return (a + b).toUpperCase();
}

function roleToSpanish(role?: string | null) {
const r = (role ?? "").toLowerCase();

if (r.includes("admin")) return "Administrador";
if (r.includes("manager")) return "Encargado";
if (r.includes("assistant")) return "Asistente";

return "Usuario";
}

export function ProfileMenu({ me }: { me: Me }) {
const [open, setOpen] = useState(false);
const rootRef = useRef<HTMLDivElement | null>(null);

const badge = useMemo(() => initials(me?.fullName || "Usuario"), [
me?.fullName,
]);

const roleLabel = useMemo(() => roleToSpanish(me?.role), [me?.role]);

useEffect(() => {
function onDocClick(e: MouseEvent) {
if (!rootRef.current) return;
if (!rootRef.current.contains(e.target as Node)) {
setOpen(false);
}
}


function onEsc(e: KeyboardEvent) {
  if (e.key === "Escape") {
    setOpen(false);
  }
}

document.addEventListener("mousedown", onDocClick);
document.addEventListener("keydown", onEsc);

return () => {
  document.removeEventListener("mousedown", onDocClick);
  document.removeEventListener("keydown", onEsc);
};


}, []);

return ( <div ref={rootRef} className="relative">
<button
type="button"
onClick={() => setOpen((v) => !v)}
className="flex items-center gap-2 rounded-2xl border border-rose-100 bg-white px-2 py-1.5 text-neutral-900 hover:bg-rose-50"
> <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-rose-100 bg-rose-50 text-xs font-extrabold text-rose-700">
{me?.avatarUrl ? ( <img
           src={me.avatarUrl}
           alt="avatar"
           className="h-full w-full object-cover"
         />
) : (
badge
)} </div>

    <div className="hidden max-w-[180px] md:block">
      <p className="truncate text-sm font-extrabold leading-4">
        {me?.fullName || "Usuario"}
      </p>

      <p className="truncate text-[11px] text-neutral-500">
        {roleLabel}
      </p>
    </div>

    <span className="hidden text-xs text-neutral-400 md:inline">▾</span>
  </button>

  {open && (
    <div className="absolute right-0 mt-2 w-[280px] rounded-2xl border border-rose-100 bg-white p-2 shadow-lg">
      <div className="rounded-2xl bg-rose-50/60 p-3">
        <p className="text-sm font-extrabold text-neutral-900">
          {me?.fullName || "Usuario"}
        </p>

        {me?.email && (
          <p className="mt-0.5 text-xs text-neutral-600">
            {me.email}
          </p>
        )}

        <span className="mt-2 inline-flex rounded-full border border-rose-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-rose-700">
          {roleLabel}
        </span>
      </div>

      <div className="mt-2 space-y-1">
        <Link
          href="/perfil"
          className="block rounded-xl px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-rose-50"
          onClick={() => setOpen(false)}
        >
          👤 Mi perfil
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-extrabold text-rose-700 hover:bg-rose-50"
          >
            🚪 Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  )}
</div>


);
}
