import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  createHmac
} from "node:crypto";
import { promisify } from "node:util";
import { ICryptoProvider } from "./ICryptoProvider";

const scrypt = promisify(scryptCallback);
const hashSeparator = ":";
const hashKeyLength = 64;

export class NodeCryptoProvider implements ICryptoProvider {
  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scrypt(password, salt, hashKeyLength)) as Buffer;
    return `${salt}${hashSeparator}${derivedKey.toString("hex")}`;
  }

  async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, storedKey] = storedHash.split(hashSeparator);

    if (!salt || !storedKey) {
      return password === storedHash; // legacy fallback if not hashed
    }

    const storedBuffer = Buffer.from(storedKey, "hex");
    const derivedKey = (await scrypt(password, salt, storedBuffer.length)) as Buffer;

    return (
      storedBuffer.length === derivedKey.length &&
      timingSafeEqual(storedBuffer, derivedKey)
    );
  }

  signPayload(payload: string, secret: string): string {
    return createHmac("sha256", secret).update(payload).digest("base64url");
  }

  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.signPayload(payload, secret);
    return signature === expectedSignature;
  }
}
