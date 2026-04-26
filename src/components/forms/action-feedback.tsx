"use client";

import type { ActionState } from "@/lib/types";

export function ActionFeedback({ state }: { state: ActionState }) {
  if (state.status !== "error" || !state.message) {
    return null;
  }

  return <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.message}</p>;
}
