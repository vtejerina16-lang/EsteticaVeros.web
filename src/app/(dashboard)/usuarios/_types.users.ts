
export type RoleName = "Administrator" | "Manager" | "Assistant";

export type CreateUserRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roleName: RoleName;
};

export type CreateUserField = keyof CreateUserRequest;

export type CreateUserFieldErrors = Partial<Record<CreateUserField, string>>;

export type CreateUserActionState =
  | { ok: true; message: string; errors?: CreateUserFieldErrors }
  | { ok: false; message: string; errors?: CreateUserFieldErrors };