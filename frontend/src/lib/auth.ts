import { NodeCryptoProvider } from "@/platform/security";

const cryptoProvider = new NodeCryptoProvider();

export {
  createSessionCookieValue,
  getAuthSession,
  getSessionCookieName,
  parseSessionCookieValue,
} from "./auth/session";

export async function hashPassword(password: string) {
  return cryptoProvider.hashPassword(password);
}

export async function verifyPassword(password: string, storedPassword: string) {
  return cryptoProvider.verifyPassword(password, storedPassword);
}
