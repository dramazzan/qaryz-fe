"use client";

import { useFormState } from "react-dom";

import { clearHistory } from "@/actions/history";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { initialActionState } from "@/lib/types";

export function HistoryClearForm({ disabled }: { disabled?: boolean }) {
  const [state, formAction] = useFormState(clearHistory, initialActionState);

  return (
    <form action={formAction} className="space-y-2">
      <ActionFeedback state={state} />
      <SubmitButton variant="outline" size="sm" pendingLabel="Очищаем..." disabled={disabled}>
        Очистить
      </SubmitButton>
    </form>
  );
}
