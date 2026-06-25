import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { seedFullSite } from "@/lib/seed-service";

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const result = await seedFullSite();
    return NextResponse.json({
      success: true,
      message: `Zaimportowano: ${result.sections} sekcji, ustawienia, ${result.categories} kategorii i ${result.dishes} dań.`,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Błąd importu pełnej strony.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
