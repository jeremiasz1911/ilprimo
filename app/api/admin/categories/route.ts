import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  CategoryInUseError,
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/lib/menu-service";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const categories = await getAllCategories();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const category = await createCategory({
      id: body.id,
      name: body.name,
      slug: body.slug,
      order: Number(body.order) || 0,
      isActive: body.isActive !== false,
    });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się dodać kategorii." },
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
      return NextResponse.json({ error: "Brak ID kategorii." }, { status: 400 });
    }
    await updateCategory(body.id, {
      name: body.name,
      slug: body.slug,
      order: Number(body.order),
      isActive: body.isActive !== false,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się zaktualizować kategorii." },
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
      return NextResponse.json({ error: "Brak ID kategorii." }, { status: 400 });
    }
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof CategoryInUseError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json(
      { error: "Nie udało się usunąć kategorii." },
      { status: 500 },
    );
  }
}
