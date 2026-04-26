"use server";

import { actionError, refreshAppPaths } from "@/actions/common";
import { backendJson } from "@/lib/backend-api";
import type { ActionState } from "@/lib/types";

export async function clearHistory(_: ActionState): Promise<ActionState> {
  try {
    await backendJson("/api/history/clear", {
      method: "POST",
      body: {}
    });

    refreshAppPaths(["/history"]);
    return { status: "idle" };
  } catch (error) {
    return actionError(error);
  }
}
