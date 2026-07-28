import { cookies } from "next/headers";
import type { AuthSession } from "@/types/auth";
import { NodeCryptoProvider, SignedCookieSessionProvider } from "@/platform/security";

const sessionCookieName = "obra_facil_session";

// Domain specific setup of Platform Capability
const cryptoProvider = new NodeCryptoProvider();
const sessionProvider = new SignedCookieSessionProvider(cryptoProvider);

export function createSessionCookieValue(session: AuthSession) {
  return sessionProvider.createSessionValue<AuthSession>(session);
}

export function parseSessionCookieValue(cookieValue: string | undefined): AuthSession | null {
  return sessionProvider.parseSessionValue<AuthSession>(cookieValue);
}

export async function getAuthSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(sessionCookieName);

  return parseSessionCookieValue(sessionCookie?.value);
}

export function getSessionCookieName() {
  return sessionCookieName;
}
