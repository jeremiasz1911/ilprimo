import { getAdminDb } from "@/lib/firebase-admin";

const USAGE_DOC = "siteSettings/usage";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_TOTAL_STORAGE_BYTES = 500 * 1024 * 1024; // 500 MB

export async function getStorageUsageBytes(): Promise<number> {
  try {
    const doc = await getAdminDb().doc(USAGE_DOC).get();
    if (!doc.exists) return 0;
    const data = doc.data() as { storageUsedBytes?: number } | undefined;
    return Number(data?.storageUsedBytes) || 0;
  } catch {
    return 0;
  }
}

export async function reserveStorageBytes(bytes: number): Promise<void> {
  await getAdminDb().runTransaction(async (tx) => {
    const ref = getAdminDb().doc(USAGE_DOC);
    const snap = await tx.get(ref);
    const current = snap.exists
      ? Number((snap.data() as { storageUsedBytes?: number }).storageUsedBytes) ||
        0
      : 0;
    const next = current + bytes;

    if (next > MAX_TOTAL_STORAGE_BYTES) {
      throw new Error("STORAGE_LIMIT_EXCEEDED");
    }

    tx.set(
      ref,
      {
        storageUsedBytes: next,
        updatedAt: Date.now(),
      },
      { merge: true },
    );
  });
}

export async function releaseStorageBytes(bytes: number): Promise<void> {
  await getAdminDb().runTransaction(async (tx) => {
    const ref = getAdminDb().doc(USAGE_DOC);
    const snap = await tx.get(ref);
    const current = snap.exists
      ? Number((snap.data() as { storageUsedBytes?: number }).storageUsedBytes) ||
        0
      : 0;
    const next = Math.max(0, current - bytes);
    tx.set(
      ref,
      {
        storageUsedBytes: next,
        updatedAt: Date.now(),
      },
      { merge: true },
    );
  });
}

