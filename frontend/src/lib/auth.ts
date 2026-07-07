import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const hashSeparator = ":";
const hashKeyLength = 64;

export {
  createSessionCookieValue,
  getAuthSession,
  getSessionCookieName,
  parseSessionCookieValue,
} from "./auth/session";

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(
    password,
    salt,
    hashKeyLength
  )) as Buffer;

  return `${salt}${hashSeparator}${derivedKey.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedPassword: string
) {
  const [salt, storedKey] = storedPassword.split(hashSeparator);

  if (!salt || !storedKey) {
    return password === storedPassword;
  }

  const storedBuffer = Buffer.from(storedKey, "hex");
  const derivedKey = (await scrypt(
    password,
    salt,
    storedBuffer.length
  )) as Buffer;

  return (
    storedBuffer.length === derivedKey.length &&
    timingSafeEqual(storedBuffer, derivedKey)
  );
}
