import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { seedDefaultPageStructure } from "@/lib/page-service";

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const result = await seedDefaultPageStructure();
    return NextResponse.json({
      success: true,
      message: `Utworzono ${result.sections} sekcji i domyślne ustawienia strony.`,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Błąd tworzenia struktury strony.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
