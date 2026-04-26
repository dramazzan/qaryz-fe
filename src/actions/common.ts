import { revalidatePath } from "next/cache";

import type { ActionState } from "@/lib/types";

export function actionError(error: unknown): ActionState {
  return {
    status: "error",
    message: error instanceof Error ? error.message : "Что-то пошло не так"
  };
}

export function refreshAppPaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}
