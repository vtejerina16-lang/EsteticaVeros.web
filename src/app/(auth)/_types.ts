export type LoginRequest = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type LoginResponseDto = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
  expiresAt: string; // ISO
};

export type LoginActionState =
  | { ok: true }
  | { ok: false; message: string };
