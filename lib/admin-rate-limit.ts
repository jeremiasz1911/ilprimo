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

function getAttemptRef(request: Request) {
  const ip = getClientIp(request);
  const key = hashKey(ip);
  return getAdminDb().collection(COLLECTION).doc(key);
}

export async function getLoginBlockStatus(
  request: Request,
): Promise<{ allowed: true } | { allowed: false; retryAfterSeconds: number }> {
  try {
    const ref = getAttemptRef(request);
    const snap = await ref.get();
    if (!snap.exists) return { allowed: true };

    const data = snap.data() as { blockedUntil?: number };
    const blockedUntil = Number(data.blockedUntil) || 0;
    const now = Date.now();

    if (blockedUntil > now) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((blockedUntil - now) / 1000),
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error("[admin-rate-limit] block status check failed:", error);
    return { allowed: true };
  }
}

export async function recordFailedLoginAttempt(request: Request): Promise<void> {
  try {
    const ref = getAttemptRef(request);
    const now = Date.now();

    await getAdminDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const data = snap.exists
        ? (snap.data() as {
            firstAttemptAt?: number;
            count?: number;
            blockedUntil?: number;
          })
        : {};

      const firstAttemptAt = Number(data.firstAttemptAt) || now;
      const withinWindow = now - firstAttemptAt <= WINDOW_MS;
      const count = withinWindow ? Number(data.count) || 0 : 0;
      const nextCount = count + 1;
      const shouldBlock = nextCount >= MAX_ATTEMPTS;

      tx.set(
        ref,
        {
          firstAttemptAt: withinWindow ? firstAttemptAt : now,
          count: nextCount,
          blockedUntil: shouldBlock ? now + BLOCK_MS : undefined,
          updatedAt: now,
        },
        { merge: true },
      );
    });
  } catch (error) {
    console.error("[admin-rate-limit] failed to record attempt:", error);
  }
}

export async function resetLoginAttempts(request: Request): Promise<void> {
  try {
    await getAttemptRef(request).delete();
  } catch (error) {
    console.error("[admin-rate-limit] failed to reset attempts:", error);
  }
}
