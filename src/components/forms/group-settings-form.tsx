"use client";

import { useFormState } from "react-dom";

import { updateGroupSettings } from "@/actions/groups";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialActionState } from "@/lib/types";

type GroupSettingsFormProps = {
  groupId: string;
  name: string;
  currencyCode: string;
  currencyLocked: boolean;
};

export function GroupSettingsForm({
  groupId,
  name,
  currencyCode,
  currencyLocked
}: GroupSettingsFormProps) {
  const [state, formAction] = useFormState(updateGroupSettings, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="groupId" value={groupId} />
      <div className="space-y-2">
        <Label htmlFor="settings-name">Название группы</Label>
        <Input id="settings-name" name="name" defaultValue={name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="settings-currency">Валюта</Label>
        <Input
          id="settings-currency"
          name="currencyCode"
          defaultValue={currencyCode}
          maxLength={3}
          disabled={currencyLocked}
          required
        />
        {currencyLocked ? (
          <p className="text-xs text-muted-foreground">После первого расхода валюта блокируется.</p>
        ) : null}
      </div>
      <ActionFeedback state={state} />
      <SubmitButton variant="secondary" className="w-full" pendingLabel="Сохраняем...">
        Сохранить настройки
      </SubmitButton>
    </form>
  );
}
