import { ICryptoProvider } from "../crypto";
import { ISessionProvider } from "./ISessionProvider";

export class SignedCookieSessionProvider implements ISessionProvider {
  constructor(private cryptoProvider: ICryptoProvider) {}

  getSessionSecret(): string {
    return (
      process.env.AUTH_SESSION_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "obra-facil-dev-session-secret"
    );
  }

  private toBase64Url(value: string) {
    return Buffer.from(value, "utf8").toString("base64url");
  }

  private fromBase64Url(value: string) {
    return Buffer.from(value, "base64url").toString("utf8");
  }

  createSessionValue<T>(sessionData: T): string {
    const payload = this.toBase64Url(JSON.stringify(sessionData));
    const signature = this.cryptoProvider.signPayload(payload, this.getSessionSecret());
    return `${payload}.${signature}`;
  }

  parseSessionValue<T>(cookieValue: string | undefined): T | null {
    if (!cookieValue) return null;

    const [payload, signature] = cookieValue.split(".");
    if (!payload || !signature) return null;

    const isValid = this.cryptoProvider.verifySignature(payload, signature, this.getSessionSecret());
    if (!isValid) return null;

    try {
      return JSON.parse(this.fromBase64Url(payload)) as T;
    } catch {
      return null;
    }
  }
}
