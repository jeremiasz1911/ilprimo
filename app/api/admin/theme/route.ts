import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import {
  applyThemePreset,
  getSiteTheme,
  resetSiteTheme,
  updateSiteTheme,
} from "@/lib/theme-service";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const theme = await getSiteTheme();
  return NextResponse.json(theme);
}

export async function PUT(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const theme = await updateSiteTheme(body);
    return NextResponse.json(theme);
  } catch {
    return NextResponse.json(
      { error: "Nie udało się zapisać motywu." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    if (body.action === "reset") {
      const theme = await resetSiteTheme();
      return NextResponse.json(theme);
    }

    if (body.action === "preset" && typeof body.presetName === "string") {
      const theme = applyThemePreset(body.presetName);
      const saved = await updateSiteTheme(theme);
      return NextResponse.json(saved);
    }

    return NextResponse.json({ error: "Nieznana akcja." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Nie udało się wykonać akcji motywu." },
      { status: 500 },
    );
  }
}
