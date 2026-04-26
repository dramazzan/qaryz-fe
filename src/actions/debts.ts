"use server";

import { redirect } from "next/navigation";

import { actionError, refreshAppPaths } from "@/actions/common";
import { backendJson } from "@/lib/backend-api";
import type { ActionState } from "@/lib/types";

type DebtResponse = {
  id: string;
};

export async function createDirectDebt(_: ActionState, formData: FormData): Promise<ActionState> {
  let redirectTo: string | null = null;

  try {
    const debt = await backendJson<DebtResponse>("/api/debts", {
      method: "POST",
      body: {
        title: formData.get("title"),
        amount: formData.get("amount"),
        currencyCode: String(formData.get("currencyCode") ?? "").toUpperCase(),
        debtDate: formData.get("debtDate"),
        note: formData.get("note") || undefined,
        direction: formData.get("direction"),
        borrowerId: formData.get("borrowerId") || undefined,
        borrowerEmail: formData.get("borrowerEmail") || undefined,
        externalCounterpartyName: formData.get("externalCounterpartyName") || undefined
      }
    });

    refreshAppPaths(["/", "/add", "/history", `/activity/debt/${debt.id}`]);
    redirectTo = `/activity/debt/${debt.id}`;
  } catch (error) {
    return actionError(error);
  }

  redirect(redirectTo);
}

export async function updateDirectDebt(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const debtId = String(formData.get("debtId") ?? "");

    await backendJson<DebtResponse>(`/api/debts/${debtId}`, {
      method: "PATCH",
      body: {
        title: formData.get("title"),
        amount: formData.get("amount"),
        currencyCode: String(formData.get("currencyCode") ?? "").toUpperCase(),
        debtDate: formData.get("debtDate"),
        note: formData.get("note") || undefined
      }
    });

    refreshAppPaths(["/", "/history", `/activity/debt/${debtId}`]);
    return { status: "idle" };
  } catch (error) {
    return actionError(error);
  }
}

export async function settleDirectDebt(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const debtId = String(formData.get("debtId") ?? "");

    await backendJson<DebtResponse>(`/api/debts/${debtId}/settle`, {
      method: "POST",
      body: {}
    });

    refreshAppPaths(["/", "/history", `/activity/debt/${debtId}`]);
    return { status: "idle" };
  } catch (error) {
    return actionError(error);
  }
}
