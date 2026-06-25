import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  getSessionCookieOptions,
  verifyCredentials,
} from "@/lib/auth";
import {
  checkAndIncrementLoginAttempts,
  resetLoginAttempts,
} from "@/lib/admin-rate-limit";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, website } = (await request.json()) as {
      username?: string;
      password?: string;
      website?: string; // honeypot
    };

    // If bot filled hidden field, fail fast with generic error.
    if (website) {
      await sleep(350);
      return NextResponse.json({ error: "Błąd logowania." }, { status: 400 });
    }

    if (!username || !password) {
      return NextResponse.json(
        { error: "Podaj login i hasło." },
        { status: 400 },
      );
    }

    const rate = await checkAndIncrementLoginAttempts(request);
    if (!rate.allowed) {
      await sleep(350);
      const response = NextResponse.json(
        { error: "Zbyt wiele prób logowania. Spróbuj ponownie później." },
        { status: 429 },
      );
      response.headers.set("Retry-After", String(rate.retryAfterSeconds));
      return response;
    }

    if (!verifyCredentials(username, password)) {
      await sleep(350);
      return NextResponse.json(
        { error: "Nieprawidłowy login lub hasło." },
        { status: 401 },
      );
    }

    await resetLoginAttempts(request);
    const token = createSessionToken(username);
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, getSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Błąd logowania." }, { status: 500 });
  }
}
