"use server";

import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login } from "../_services/auth-service";
import type { LoginActionState } from "../_types";
import { HttpError } from "@/lib/http";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "veros_access_token";
const FALLBACK_MAX_AGE = Number(process.env.AUTH_COOKIE_MAX_AGE ?? "86400");

function computeMaxAgeSeconds(expiresAt?: string) {
  if (!expiresAt) return FALLBACK_MAX_AGE;
  const ms = new Date(expiresAt).getTime();
  if (!Number.isFinite(ms)) return FALLBACK_MAX_AGE;
  const sec = Math.floor((ms - Date.now()) / 1000);
  return Number.isFinite(sec) && sec > 0 ? sec : FALLBACK_MAX_AGE;
}

export async function loginAction(
  _prev: LoginActionState | undefined,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const rememberMe = formData.get("rememberMe") === "on";

  if (!email || !password) {
    return { ok: false, message: "Email y contraseña son obligatorios." };
  }

  let dto: any;
  try {

    dto = await login({ email, password, rememberMe });
  } catch (e) {
    if (e instanceof HttpError) {
      console.error("LOGIN BACKEND ERROR:", e.status, e.payload);
      const payload = e.payload as any;
      const backendMsg =
        payload && (payload.message || payload.error || payload.title)
          ? String(payload.message || payload.error || payload.title)
          : "";
      return { ok: false, message: backendMsg || `Error de autenticación (${e.status}).` };
    }

    console.error("LOGIN UNEXPECTED ERROR:", e);
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    return { ok: false, message: msg };
  }

  const token = dto?.token;
  if (!token) {
    console.error("LOGIN DTO WITHOUT TOKEN:", dto);
    return { ok: false, message: "Respuesta inválida del servidor (sin token)." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // ✅ dev (tu app corre en http://localhost:3000)
    maxAge: computeMaxAgeSeconds(dto?.expiresAt),
    path: "/",
  });

  redirect("/dashboard"); // ✅ fuera del try/catch
}
