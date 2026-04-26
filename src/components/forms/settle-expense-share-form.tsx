"use client";

import { useFormState } from "react-dom";

import { settleExpenseParticipant } from "@/actions/expenses";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { initialActionState } from "@/lib/types";

export function SettleExpenseShareForm({ participantId }: { participantId: string }) {
  const [state, formAction] = useFormState(settleExpenseParticipant, initialActionState);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="participantId" value={participantId} />
      <ActionFeedback state={state} />
      <SubmitButton variant="outline" size="sm" pendingLabel="Погашаем...">
        Отметить как оплачено
      </SubmitButton>
    </form>
  );
}
