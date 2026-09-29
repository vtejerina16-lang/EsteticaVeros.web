export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponseDto = {
  accessToken: string;
  // opcional (depende de tu backend):
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    uid?: string;
    username?: string;
    role?: string;
    permissions?: string[];
  };
};

export type SessionUser = {
  uid?: string;
  username?: string;
  role?: string;
  permissions?: string[];
};

export type LoginActionState =
  | { ok: true }
  | { ok: false; message: string };
