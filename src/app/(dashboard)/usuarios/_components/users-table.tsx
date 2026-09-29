import type { UserRow } from "../_adapters/user-adapter";
import { UserActions } from "./user-actions";

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "roleAdmin" | "roleManager" | "roleAssistant" | "active" | "inactive";
}) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold";

  const styles: Record<typeof variant, string> = {
    roleAdmin: "bg-rose-50 text-[rgb(var(--brand))] border border-rose-200",
    roleManager: "bg-amber-50 text-amber-700 border border-amber-200",
    roleAssistant: "bg-sky-50 text-sky-700 border border-sky-200",
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    inactive: "bg-neutral-100 text-neutral-600 border border-neutral-200",
  };

  return <span className={`${base} ${styles[variant]}`}>{children}</span>;
}

function roleBadge(roleName: string) {
  const r = (roleName ?? "").toLowerCase();

  if (r === "administrator" || r === "admin")
    return <Badge variant="roleAdmin"> ADMINISTRADOR</Badge>;

  if (r === "manager" || r === "receptionist")
    return <Badge variant="roleManager"> ENCARGADO</Badge>;

  return <Badge variant="roleAssistant"> ASISTENTE</Badge>;
}

export function UsersTable({ rows }: { rows: UserRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-rose-100">

      {/* CABECERA */}
      <div className="grid grid-cols-[1.4fr_1.6fr_1.2fr_0.9fr_0.9fr_1fr] gap-3 bg-rose-50 px-4 py-3 text-xs font-bold text-neutral-700">
        <div>Usuario</div>
        <div>Nombre completo</div>
        <div>Último acceso</div>
        <div>Rol</div>
        <div>Estado</div>
        <div className="text-right">Acciones</div>
      </div>

      {rows.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-neutral-500">
          No existen usuarios registrados en el sistema.
        </div>
      ) : (
        <div className="divide-y divide-rose-100">
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[1.4fr_1.6fr_1.2fr_0.9fr_0.9fr_1fr] gap-3 px-4 py-3 text-sm text-neutral-800"
            >
              
              {/* USUARIO */}
              <div className="font-semibold">
                {r.email}
                <div className="text-[11px] text-neutral-500">
                  ID Usuario: {r.id}
                </div>
              </div>

              {/* PERSONA */}
              <div className="font-medium">
                {r.fullName || "No especificado"}
              </div>

              {/* ULTIMO ACCESO */}
              <div className="text-neutral-600">
                {r.lastAccess ?? "Sin registros"}
              </div>

              {/* ROL */}
              <div>
                {roleBadge(r.roleName)}
              </div>

              {/* ESTADO */}
              <div>
                {r.isActive ? (
                  <Badge variant="active">ACTIVO</Badge>
                ) : (
                  <Badge variant="inactive">INACTIVO</Badge>
                )}
              </div>

              {/* ACCIONES */}
              <UserActions user={r} />

            </div>
          ))}
        </div>
      )}
    </div>
  );
}