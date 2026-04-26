"use client";

import { useFormState } from "react-dom";

import { createGroup } from "@/actions/groups";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialActionState } from "@/lib/types";

export function GroupCreateForm() {
  const [state, formAction] = useFormState(createGroup, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="group-name">Название группы</Label>
        <Input id="group-name" name="name" placeholder="Семья" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="group-currency">Валюта</Label>
        <Input id="group-currency" name="currencyCode" defaultValue="USD" maxLength={3} required />
      </div>
      <ActionFeedback state={state} />
      <SubmitButton className="w-full" size="lg" pendingLabel="Создаём...">
        Создать группу
      </SubmitButton>
    </form>
  );
}
