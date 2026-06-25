import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  createPageSection,
  deletePageSection,
  getAllPageSections,
  updatePageSection,
} from "@/lib/page-service";
import type { PageSectionType } from "@/lib/types";

function parseSectionBody(body: Record<string, unknown>) {
  return {
    id: body.id as string | undefined,
    type: body.type as PageSectionType,
    title: String(body.title ?? ""),
    subtitle: String(body.subtitle ?? ""),
    content: String(body.content ?? ""),
    buttonText: String(body.buttonText ?? ""),
    buttonLink: String(body.buttonLink ?? ""),
    image: String(body.image ?? ""),
    order: Number(body.order) || 0,
    isActive: body.isActive !== false,
    showInNavigation: body.showInNavigation === true,
    navigationLabel: String(body.navigationLabel ?? ""),
  };
}

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const sections = await getAllPageSections();
  return NextResponse.json(sections);
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const data = parseSectionBody(body);
    const section = await createPageSection(data);
    return NextResponse.json(section, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się dodać sekcji." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Brak ID sekcji." }, { status: 400 });
    }
    const data = parseSectionBody(body);
    const { id, ...payload } = data;
    await updatePageSection(body.id as string, payload);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się zaktualizować sekcji." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Brak ID sekcji." }, { status: 400 });
    }
    await deletePageSection(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się usunąć sekcji." },
      { status: 500 },
    );
  }
}
