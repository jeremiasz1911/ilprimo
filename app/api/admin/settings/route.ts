import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/page-service";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const settings = await updateSiteSettings({
      restaurantName: body.restaurantName,
      address: body.address,
      phone: body.phone,
      email: body.email,
      facebookUrl: body.facebookUrl,
      instagramUrl: body.instagramUrl,
      footerText: body.footerText,
      logo: body.logo,
      copyrightText: body.copyrightText,
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Nie udało się zapisać ustawień." },
      { status: 500 },
    );
  }
}
