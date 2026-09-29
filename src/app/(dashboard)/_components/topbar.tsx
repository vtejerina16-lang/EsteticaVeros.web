import "server-only";

import { logoutAction } from "@/shared/actions/auth-actions";
import { getAccessToken } from "@/lib/auth";
import { getMe } from "../dashboard/_services/me-service";
import { ProfileMenu } from "./profile-menu";
import { Clock } from "./clock";

export async function Topbar({ token }: { token?: string }) {
  const accessToken = token ?? (await getAccessToken());
  const me =
    (await getMe(accessToken)) ?? {
      fullName: "Usuario",
      role: "—",
      email: undefined,
      avatarUrl: null,
    };

  // Extraemos el primer nombre para el saludo dinámico
  const firstName = me.fullName ? me.fullName.split(" ")[0] : "Admin";

  return (
    <header className="rounded-[28px] border border-rose-100 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-md md:px-5">
      <div className="flex items-center justify-between gap-3">
        
        {/* Lado Izquierdo: Saludo + Reloj integrados */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-bold text-neutral-800 md:text-base leading-none">
              ¡Hola, {firstName}! 👋
            </h1>
          </div>
          
          {/* Componente del reloj formateado como subtítulo / badge */}
          <div className="flex items-center text-xs text-neutral-500">
            <Clock />
          </div>
        </div>

        {/* Lado Derecho: Menú de Perfil + Cerrar Sesión */}
        <div className="hidden items-center gap-3 md:flex">
          <ProfileMenu me={me} />

          <form action={logoutAction}>
            <button 
              type="submit"
              className="h-10 rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-neutral-800 transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        {/* Vista Móvil */}
        <div className="flex items-center gap-2 md:hidden">
          <ProfileMenu me={me} />
          
          <form action={logoutAction}>
            <button 
              type="submit"
              className="h-10 rounded-2xl border border-rose-100 bg-white px-3 text-sm font-semibold text-neutral-800 transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95"
            >
              Salir
            </button>
          </form>
        </div>

      </div>
    </header>
  );
}