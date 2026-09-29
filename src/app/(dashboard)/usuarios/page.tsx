// src/app/(dashboard)/usuarios/page.tsx
import "server-only";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { HttpError } from "@/lib/http";

import { UsersTable } from "./_components/users-table";
import { UsersFilters } from "./_components/users-filters";
import { UsersPagination } from "./_components/users-pagination";
import { listUsers } from "./_services/users-service";
import { toUserRow } from "./_adapters/user-adapter";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const pickOne = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  const token = await getAccessToken();
  if (!token) redirect("/login");

  const search = pickOne(sp.search) ?? "";

  const page = Number(pickOne(sp.page) ?? 1);
  const perPage = Number(pickOne(sp.per_page) ?? 10);

  const isActiveRaw = pickOne(sp.is_active);
  const initialIsActive: "all" | "true" | "false" =
    isActiveRaw === "true" ? "true" : isActiveRaw === "false" ? "false" : "all";

  const isActive = isActiveRaw === "true" ? true : isActiveRaw === "false" ? false : undefined;

  try {
    const res = await listUsers(token, {
      page,
      perPage,
      search: search || undefined,
      isActive,
    });

    const rows = (res.users ?? []).map(toUserRow);

    const metaPage = res.page ?? page;
    const metaPerPage = res.perPage ?? perPage;
    const totalPages = res.totalPages ?? 1;
    const totalCount = res.totalCount ?? rows.length;

    return (
      <section className="rounded-2xl border border-rose-100 bg-white p-4 md:p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-rose-600">Directorio</p>
            <h1 className="text-xl font-extrabold text-neutral-900">Usuarios</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-rose-50">
              Exportar
            </button>

            <Link
              href="/usuarios/nuevo"
              className="rounded-full bg-[rgb(var(--brand))] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              + Nuevo usuario
            </Link>
          </div>
        </div>

        <UsersFilters initialSearch={search} initialIsActive={initialIsActive} />

        <div className="mt-4">
          <UsersTable rows={rows} />

          <UsersPagination
            base={{ search, isActive: initialIsActive }}
            page={metaPage}
            pageSize={metaPerPage}
            total={totalCount}
            totalPages={totalPages}
          />
        </div>
      </section>
    );
  } catch (e) {
    if (e instanceof HttpError && e.status === 403) redirect("/dashboard");
    throw e;
  }
}