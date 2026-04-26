"use client";

import { useFormState } from "react-dom";

import { settleDirectDebt } from "@/actions/debts";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { initialActionState } from "@/lib/types";

export function SettleDirectDebtForm({ debtId }: { debtId: string }) {
  const [state, formAction] = useFormState(settleDirectDebt, initialActionState);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="debtId" value={debtId} />
      <ActionFeedback state={state} />
      <SubmitButton className="w-full" pendingLabel="Погашаем...">
        Отметить долг как оплаченный
      </SubmitButton>
    </form>
  );
}
