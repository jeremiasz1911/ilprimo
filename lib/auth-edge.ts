import type { NextRequest } from "next/server";
import { normalizeEnvValue } from "@/lib/env-utils";

const ADMIN_COOKIE = "ilprimo_admin_session";

function getSessionSecret(): string {
  return (
    normalizeEnvValue(process.env.ADMIN_SESSION_SECRET) ||
    `${normalizeEnvValue(process.env.ADMIN_PASSWORD)}-ilprimo-session`
  );
}

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Array.from(binary, (char) => String.fromCharCode(char.charCodeAt(0))).join(
    "",
  );
}

async function hmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    const decoded = decodeBase64Url(token);
    const separator = decoded.lastIndexOf("|");
    if (separator === -1) return false;

    const payload = decoded.slice(0, separator);
    const signature = decoded.slice(separator + 1);
    const expected = await hmacSha256(getSessionSecret(), payload);

    if (signature.length !== expected.length) return false;

    let mismatch = 0;
    for (let i = 0; i < signature.length; i++) {
      mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    if (mismatch !== 0) return false;

    const data = JSON.parse(payload) as { username: string; exp: number };
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function verifySessionFromRequest(
  request: NextRequest,
): Promise<boolean> {
  return verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
}
