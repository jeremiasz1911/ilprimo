import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { getAdminStorage } from "@/lib/firebase-admin";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Brak pliku." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `dishes/${randomUUID()}.${extension}`;
    const bucket = getAdminStorage().bucket();
    const fileRef = bucket.file(fileName);

    await fileRef.save(buffer, {
      metadata: { contentType: file.type || "image/jpeg" },
    });

    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się przesłać zdjęcia." },
      { status: 500 },
    );
  }
}
