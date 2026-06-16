export type AuthUserRole = "CLIENT" | "PROFESSIONAL" | "ADMIN";

export type AuthSession = {
  userId: string;
  clienteId: string | null;
  name: string;
  email: string;
  role: AuthUserRole;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type AuthResponse = {
  user: AuthSession;
};

export type AuthErrorResponse = {
  error: string;
};
