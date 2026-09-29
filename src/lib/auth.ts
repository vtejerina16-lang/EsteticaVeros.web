import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "veros_access_token";

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}
