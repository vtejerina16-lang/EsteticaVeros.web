import "server-only";
import { fetchJson } from "@/lib/http";
import type { LoginRequest, LoginResponseDto } from "../_types";

export async function login(request: LoginRequest): Promise<LoginResponseDto> {
  return fetchJson<LoginResponseDto>("/api/auth/login", {
    method: "POST",
    body: request,
  });
}
