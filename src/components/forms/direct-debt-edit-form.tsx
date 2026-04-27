"use client";

import { useFormState } from "react-dom";

import { updateDirectDebt } from "@/actions/debts";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatForDateInput } from "@/lib/dates";
import { initialActionState } from "@/lib/types";

type DirectDebtEditFormProps = {
  debt: {
    id: string;
    title: string;
    amountMinor: number;
    currencyCode: string;
    note: string | null;
    debtDate: Date;
  };
};

export function DirectDebtEditForm({ debt }: DirectDebtEditFormProps) {
  const [state, formAction] = useFormState(updateDirectDebt, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="debtId" value={debt.id} />
      <input type="hidden" name="currencyCode" value={debt.currencyCode} />
      <div className="space-y-2">
        <Label htmlFor="edit-debt-title">Название</Label>
        <Input id="edit-debt-title" name="title" defaultValue={debt.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-debt-amount">Сумма</Label>
        <Input
          id="edit-debt-amount"
          name="amount"
          inputMode="decimal"
          defaultValue={(debt.amountMinor / 100).toFixed(2)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-debt-date">Дата</Label>
        <Input id="edit-debt-date" name="debtDate" type="date" defaultValue={formatForDateInput(debt.debtDate)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-debt-note">Заметка</Label>
        <Textarea id="edit-debt-note" name="note" defaultValue={debt.note ?? ""} className="min-h-[96px]" />
      </div>
      <ActionFeedback state={state} />
      <SubmitButton variant="secondary" className="w-full" pendingLabel="Обновляем...">
        Обновить долг
      </SubmitButton>
    </form>
  );
}
