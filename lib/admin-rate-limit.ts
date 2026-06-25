import { createHash } from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";

const COLLECTION = "adminSecurityLoginAttempts";

const WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_ATTEMPTS = 7;
const BLOCK_MS = 30 * 60 * 1000; // 30 min

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function hashKey(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || "ilprimo-admin-security";
  return createHash("sha256").update(`${secret}|${value}`).digest("hex");
}

export async function checkAndIncrementLoginAttempts(
  request: Request,
): Promise<{ allowed: true } | { allowed: false; retryAfterSeconds: number }> {
  const ip = getClientIp(request);
  const key = hashKey(ip);
  const ref = getAdminDb().collection(COLLECTION).doc(key);
  const now = Date.now();

  return await getAdminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists
      ? (snap.data() as {
          firstAttemptAt?: number;
          count?: number;
          blockedUntil?: number;
        })
      : {};

    const blockedUntil = Number(data.blockedUntil) || 0;
    if (blockedUntil > now) {
      return {
        allowed: false as const,
        retryAfterSeconds: Math.ceil((blockedUntil - now) / 1000),
      };
    }

    const firstAttemptAt = Number(data.firstAttemptAt) || now;
    const withinWindow = now - firstAttemptAt <= WINDOW_MS;
    const count = withinWindow ? Number(data.count) || 0 : 0;
    const nextCount = count + 1;

    const shouldBlock = nextCount >= MAX_ATTEMPTS;
    const nextBlockedUntil = shouldBlock ? now + BLOCK_MS : 0;

    tx.set(
      ref,
      {
        firstAttemptAt: withinWindow ? firstAttemptAt : now,
        count: nextCount,
        blockedUntil: nextBlockedUntil || undefined,
        updatedAt: now,
      },
      { merge: true },
    );

    if (shouldBlock) {
      return {
        allowed: false as const,
        retryAfterSeconds: Math.ceil(BLOCK_MS / 1000),
      };
    }

    return { allowed: true as const };
  });
}

export async function resetLoginAttempts(request: Request): Promise<void> {
  const ip = getClientIp(request);
  const key = hashKey(ip);
  const ref = getAdminDb().collection(COLLECTION).doc(key);
  try {
    await ref.delete();
  } catch {
    // ignore
  }
}

