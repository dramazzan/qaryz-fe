"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { actionError, refreshAppPaths } from "@/actions/common";
import { backendForm, backendJson } from "@/lib/backend-api";
import type { ActionState } from "@/lib/types";

type ExpenseResponse = {
  id: string;
  groupId: string;
};

type ExpenseParticipantResponse = {
  id: string;
};

export async function createExpense(_: ActionState, formData: FormData): Promise<ActionState> {
  let redirectTo: string | null = null;

  try {
    const expense = await backendForm<ExpenseResponse>("/api/expenses", formData, {
      method: "POST"
    });

    cookies().set("qaryz_last_group_id", expense.groupId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90
    });

    refreshAppPaths(["/", "/add", "/history", `/groups/${expense.groupId}`, `/activity/expense/${expense.id}`]);
    redirectTo = `/activity/expense/${expense.id}`;
  } catch (error) {
    return actionError(error);
  }

  redirect(redirectTo);
}

export async function settleExpenseParticipant(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const participantId = String(formData.get("participantId") ?? "");

    const participant = await backendJson<ExpenseParticipantResponse>(
      `/api/expenses/participants/${participantId}/settle`,
      {
        method: "POST",
        body: {}
      }
    );

    refreshAppPaths(["/", "/history", `/activity/expense/${participant.id}`]);
    return { status: "idle" };
  } catch (error) {
    return actionError(error);
  }
}
