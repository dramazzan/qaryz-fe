import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/backend-api";
import { normalizeReturnTo } from "@/lib/return-to";

type SessionExchangeResponse = {
  sessionToken?: string;
  expires?: string;
  maxAge?: number;
};

function getBackendUrl(path: string) {
  const baseUrl =
    process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_ORIGIN ?? "https://qaryz-be.onrender.com";
  return new URL(path, baseUrl).toString();
}

function redirectToLogin(request: NextRequest, error: string, returnTo: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", error);

  if (returnTo !== "/") {
    url.searchParams.set("returnTo", returnTo);
  }

  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const returnTo = normalizeReturnTo(request.nextUrl.searchParams.get("returnTo"));

  if (!code) {
    return redirectToLogin(request, "state", returnTo);
  }

  const exchangeResponse = await fetch(getBackendUrl("/auth/session/exchange"), {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ code }),
    cache: "no-store"
  });

  if (!exchangeResponse.ok) {
    return redirectToLogin(request, "session", returnTo);
  }

  const payload = (await exchangeResponse.json()) as SessionExchangeResponse;

  if (!payload.sessionToken || !payload.expires) {
    return redirectToLogin(request, "session", returnTo);
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url));
  response.cookies.set(SESSION_COOKIE_NAME, payload.sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(payload.expires),
    maxAge: payload.maxAge
  });

  return response;
}
