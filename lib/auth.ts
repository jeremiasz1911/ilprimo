import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { normalizeEnvValue } from "@/lib/env-utils";

export const ADMIN_COOKIE = "ilprimo_admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getSessionSecret(): string {
  return (
    normalizeEnvValue(process.env.ADMIN_SESSION_SECRET) ||
    `${normalizeEnvValue(process.env.ADMIN_PASSWORD)}-ilprimo-session`
  );
}

export function createSessionToken(username: string): string {
  const payload = JSON.stringify({
    username,
    exp: Date.now() + SESSION_TTL_MS,
  });
  const signature = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const separator = decoded.lastIndexOf("|");
    if (separator === -1) return false;

    const payload = decoded.slice(0, separator);
    const signature = decoded.slice(separator + 1);
    const expected = createHmac("sha256", getSessionSecret())
      .update(payload)
      .digest("hex");

    const sigBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expected, "utf8");
    if (
      sigBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return false;
    }

    const data = JSON.parse(payload) as { username: string; exp: number };
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

export function verifyCredentials(
  username: string,
  password: string,
): boolean {
  const adminUsername = normalizeEnvValue(process.env.ADMIN_USERNAME);
  const adminPassword = normalizeEnvValue(process.env.ADMIN_PASSWORD);
  if (!adminUsername || !adminPassword) return false;
  return username === adminUsername && password === adminPassword;
}

export function verifySessionFromRequest(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}
