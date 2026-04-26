import { redirect } from "next/navigation";
import { cache } from "react";

import type { ApiUser } from "@/lib/api-types";
import { BackendApiError, backendGet } from "@/lib/backend-api";

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
    redirect("/login");
  }

  return user;
}

export async function getOptionalUser() {
  return getCurrentUser();
}
