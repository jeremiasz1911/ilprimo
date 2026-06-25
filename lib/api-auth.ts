import { NextResponse, type NextRequest } from "next/server";
import { verifySessionFromRequest } from "@/lib/auth";

export function requireAdmin(request: NextRequest) {
  if (!verifySessionFromRequest(request)) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }
  return null;
}
