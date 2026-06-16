import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import type { AuthSession } from "@/types/auth";

const scrypt = promisify(scryptCallback);
const sessionCookieName = "obra_facil_session";
const hashSeparator = ":";
const hashKeyLength = 64;

function getSessionSecret() {
  return (
    process.env.AUTH_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "obra-facil-dev-session-secret"
  );
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signSessionPayload(payload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

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
    return false;
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

export function createSessionCookieValue(session: AuthSession) {
  const payload = toBase64Url(JSON.stringify(session));
  const signature = signSessionPayload(payload);

  return `${payload}.${signature}`;
}

export function parseSessionCookieValue(
  cookieValue: string | undefined
): AuthSession | null {
  if (!cookieValue) {
    return null;
  }

  const [payload, signature] = cookieValue.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(payload);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    return JSON.parse(fromBase64Url(payload)) as AuthSession;
  } catch {
    return null;
  }
}

export async function getAuthSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(sessionCookieName);

  return parseSessionCookieValue(sessionCookie?.value);
}

export function getSessionCookieName() {
  return sessionCookieName;
}
