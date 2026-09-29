import "server-only";

export type Me = {
  id?: string;
  fullName: string;
  email?: string;
  role?: string;
  avatarUrl?: string | null;
};

function b64urlToJson(b64url: string) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const str = Buffer.from(b64 + pad, "base64").toString("utf8");
  return JSON.parse(str);
}

function decodeJwtClaims(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    return b64urlToJson(parts[1]);
  } catch {
    return null;
  }
}

function meFromClaims(claims: Record<string, any> | null): Me | null {
  if (!claims) return null;

  const fullName =
    claims.name ??
    claims.full_name ??
    [claims.given_name, claims.family_name].filter(Boolean).join(" ") ??
    claims.unique_name ??
    claims.email ??
    "Usuario";

  const email = claims.email ?? claims.unique_name;
  const role =
    claims.role ??
    claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    claims.roles?.[0];

  return {
    id: claims.sub ?? claims.nameid ?? claims.userId,
    fullName,
    email,
    role,
    avatarUrl: null,
  };
}

async function tryFetchMe(baseUrl: string, token: string, path: string): Promise<Me | null> {
  const url = `${baseUrl.replace(/\/$/, "")}${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data: any = await res.json();

  // Ajusta aquí si tu backend devuelve otros nombres de campos
  return {
    id: data.id ?? data.userId ?? data.user?.id,
    fullName: data.fullName ?? data.nombreCompleto ?? data.name ?? "Usuario",
    email: data.email ?? data.correo ?? data.user?.email,
    role: data.role ?? data.rol ?? data.user?.role,
    avatarUrl: data.avatarUrl ?? data.photoUrl ?? data.user?.avatarUrl ?? null,
  };
}

/**
 * Obtiene el usuario autenticado desde backend.
 * Requiere que definas API_URL (base del backend) en .env
 * Ej: API_URL=http://localhost:5000
 */
export async function getMe(token: string | null): Promise<Me | null> {
  if (!token) return null;

  const baseUrl =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "";

  // Si no hay baseUrl configurada, al menos mostramos claims del JWT
  if (!baseUrl) return meFromClaims(decodeJwtClaims(token));

  // Intentamos endpoints comunes (elige 1 cuando confirmes tu ruta real)
  const candidates = [
    "/api/auth/me",
    "/api/users/me",
    "/api/usuarios/me",
    "/auth/me",
    "/users/me",
  ];

  for (const path of candidates) {
    try {
      const me = await tryFetchMe(baseUrl, token, path);
      if (me) return me;
    } catch {
      // seguimos probando
    }
  }

  // Fallback: claims del JWT
  return meFromClaims(decodeJwtClaims(token));
}