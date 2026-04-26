"use server";

import { actionError, refreshAppPaths } from "@/actions/common";
import { backendJson } from "@/lib/backend-api";
import type { ActionState } from "@/lib/types";

export async function addFriend(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await backendJson("/api/friends", {
      method: "POST",
      body: {
        email: formData.get("email")
      }
    });

    refreshAppPaths(["/friends", "/add"]);
    return { status: "idle" };
  } catch (error) {
    return actionError(error);
  }
}
