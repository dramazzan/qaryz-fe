"use server";

import { actionError, refreshAppPaths } from "@/actions/common";
import { backendJson } from "@/lib/backend-api";
import type { ActionState } from "@/lib/types";

export async function markNotificationRead(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const notificationId = String(formData.get("notificationId") ?? "");

    await backendJson(`/api/notifications/${notificationId}/read`, {
      method: "POST",
      body: {}
    });

    refreshAppPaths(["/profile"]);
    return { status: "idle" };
  } catch (error) {
    return actionError(error);
  }
}
