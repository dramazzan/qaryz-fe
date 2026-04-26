"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { backendJson, SESSION_COOKIE_NAME } from "@/lib/backend-api";

export async function signOutUser() {
  try {
    await backendJson("/auth/logout", {
      method: "POST",
      body: {}
    });
  } catch {
    // Local cookie cleanup below is enough for the frontend to leave the session.
  }

  cookies().delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
