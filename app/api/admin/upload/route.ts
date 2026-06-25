import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { getAdminStorage } from "@/lib/firebase-admin";
import { randomUUID } from "crypto";
import {
  MAX_TOTAL_STORAGE_BYTES,
  MAX_UPLOAD_BYTES,
  releaseStorageBytes,
  reserveStorageBytes,
} from "@/lib/storage-usage";

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Brak pliku." }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Maksymalny rozmiar pliku to 10 MB." },
        { status: 413 },
      );
    }

    try {
      await reserveStorageBytes(file.size);
    } catch (error) {
      if (error instanceof Error && error.message === "STORAGE_LIMIT_EXCEEDED") {
        return NextResponse.json(
          {
            error:
              "Przekroczono limit 500 MB na zdjęcia. Usuń część plików lub zwiększ limit.",
            limitBytes: MAX_TOTAL_STORAGE_BYTES,
          },
          { status: 413 },
        );
      }
      throw error;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `dishes/${randomUUID()}.${extension}`;
    const bucket = getAdminStorage().bucket();
    const fileRef = bucket.file(fileName);

    try {
      await fileRef.save(buffer, {
        metadata: {
          contentType: file.type || "image/jpeg",
          cacheControl: "public, max-age=31536000, immutable",
        },
      });

      await fileRef.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return NextResponse.json({ url: publicUrl });
    } catch (error) {
      await releaseStorageBytes(file.size);
      throw error;
    }
  } catch {
    return NextResponse.json(
      { error: "Nie udało się przesłać zdjęcia." },
      { status: 500 },
    );
  }
}
