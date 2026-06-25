import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  getSessionCookieOptions,
  verifyCredentials,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return NextResponse.json(
        { error: "Podaj login i hasło." },
        { status: 400 },
      );
    }

    if (!verifyCredentials(username, password)) {
      return NextResponse.json(
        { error: "Nieprawidłowy login lub hasło." },
        { status: 401 },
      );
    }

    const token = createSessionToken(username);
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, getSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Błąd logowania." }, { status: 500 });
  }
}
