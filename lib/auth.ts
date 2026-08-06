import crypto from "crypto";
import { cookies } from "next/headers";

export type AdminSession = {
  email: string;
  name?: string;
  picture?: string;
  provider?: "password" | "google";
  exp: number;
};

const sessionCookie = "scripts_spirits_admin";
const sessionMaxAgeSeconds = 60 * 60 * 8;

function getAuthSecret() {
  return process.env.AUTH_COOKIE_SECRET || "scripts-spirits-dev-secret";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function encode(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode<T>(value: string) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
}

export function createSignedToken(payload: unknown) {
  const encoded = encode(payload);
  return `${encoded}.${sign(encoded)}`;
}

export function readSignedToken<T>(token?: string) {
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || sign(encoded) !== signature) return null;

  try {
    return decode<T>(encoded);
  } catch {
    return null;
  }
}

export function getAllowedAdminEmails() {
  return (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(/[,\n]/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string) {
  const allowed = getAllowedAdminEmails();
  return allowed.length > 0 && allowed.includes(email.toLowerCase());
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = readSignedToken<AdminSession>(cookieStore.get(sessionCookie)?.value);

  if (!session || session.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  if (session.provider !== "password" && !isAdminEmail(session.email)) {
    return null;
  }

  return session;
}

export async function setAdminSession(session: Omit<AdminSession, "exp">) {
  const cookieStore = await cookies();
  const exp = Math.floor(Date.now() / 1000) + sessionMaxAgeSeconds;

  cookieStore.set(sessionCookie, createSignedToken({ ...session, exp }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAgeSeconds,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookie);
}

export function authConfigReady() {
  return Boolean(
    process.env.SCRIPTS_SPIRITS_ADMIN_WEBHOOK_URL ||
      (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
  );
}

export function getBaseUrl(request: Request) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`
  );
}
