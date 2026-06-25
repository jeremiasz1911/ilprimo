import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  createDish,
  deleteDish,
  getAllDishes,
  updateDish,
} from "@/lib/menu-service";
import { PLACEHOLDER_DISH_IMAGE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const dishes = await getAllDishes();
  return NextResponse.json(dishes);
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const dish = await createDish({
      id: body.id,
      slug: body.slug,
      categoryId: body.categoryId,
      name: body.name,
      price: body.price,
      shortDescription: body.shortDescription,
      longDescription: body.longDescription,
      ingredients: body.ingredients ?? [],
      allergens: body.allergens ?? [],
      image: body.image || PLACEHOLDER_DISH_IMAGE,
      isVegetarian: Boolean(body.isVegetarian),
      isSpicy: Boolean(body.isSpicy),
      isGlutenFree: Boolean(body.isGlutenFree),
      isAvailable: body.isAvailable !== false,
      order: Number(body.order) || 0,
    });
    return NextResponse.json(dish, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się dodać dania." },
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
      return NextResponse.json({ error: "Brak ID dania." }, { status: 400 });
    }
    await updateDish(body.id, {
      slug: body.slug,
      categoryId: body.categoryId,
      name: body.name,
      price: body.price,
      shortDescription: body.shortDescription,
      longDescription: body.longDescription,
      ingredients: body.ingredients,
      allergens: body.allergens,
      image: body.image,
      isVegetarian: Boolean(body.isVegetarian),
      isSpicy: Boolean(body.isSpicy),
      isGlutenFree: Boolean(body.isGlutenFree),
      isAvailable: Boolean(body.isAvailable),
      order: Number(body.order),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się zaktualizować dania." },
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
      return NextResponse.json({ error: "Brak ID dania." }, { status: 400 });
    }
    await deleteDish(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się usunąć dania." },
      { status: 500 },
    );
  }
}
