import "server-only";

type FetchJsonOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  token?: string;
};

export class HttpError extends Error {
  constructor(
    public status: number,
    public payload: unknown,
    message = "HTTP Error",
  ) {
    super(message);
  }
}

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

const BASE_URL = getEnv("BACKEND_BASE_URL").replace(/\/$/, "");

export async function fetchJson<T>(path: string, opts: FetchJsonOptions = {}): Promise<T> {
  const method = opts.method ?? "GET";
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    ...(opts.headers ?? {}),
  };

  // ✅ SOLO poner Content-Type si realmente hay body
  const hasBody = opts.body !== undefined && method !== "GET" && method !== "DELETE";
  if (hasBody) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method,
    headers,
    body: hasBody ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    throw new HttpError(res.status, payload, `Request failed: ${res.status}`);
  }

  return payload as T;
}
