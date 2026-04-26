import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cache } from "react";

import type { ApiUser } from "@/lib/api-types";
import { BackendApiError, backendGet } from "@/lib/backend-api";
import { normalizeReturnTo } from "@/lib/return-to";

const getCurrentUser = cache(async () => {
  try {
    return await backendGet<ApiUser>("/auth/me");
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 401) {
      return null;
    }

    throw error;
  }
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user?.id) {
    const requestHeaders = headers();
    const returnTo = normalizeReturnTo(
      `${requestHeaders.get("x-qaryz-pathname") ?? "/"}${requestHeaders.get("x-qaryz-search") ?? ""}`
    );
    const loginPath = returnTo === "/" ? "/login" : `/login?${new URLSearchParams({ returnTo }).toString()}`;

    redirect(loginPath);
  }

  return user;
}

export async function getOptionalUser() {
  return getCurrentUser();
}
