"use server";

import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "veros_access_token";

export async function logoutAction() {
  const store = await cookies();
  store.delete({ name: COOKIE_NAME, path: "/" });
  redirect("/login");
}
