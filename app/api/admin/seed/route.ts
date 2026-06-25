import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { seedFirestoreFromMenuData } from "@/lib/menu-service";

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const result = await seedFirestoreFromMenuData();
    return NextResponse.json({
      success: true,
      message: `Zaimportowano ${result.categories} kategorii i ${result.dishes} dań.`,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Błąd importu danych.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
