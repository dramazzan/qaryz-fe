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
};

export function GroupSettingsForm({
  groupId,
  name,
  currencyCode
}: GroupSettingsFormProps) {
  const [state, formAction] = useFormState(updateGroupSettings, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="groupId" value={groupId} />
      <input type="hidden" name="currencyCode" value={currencyCode} />
      <div className="space-y-2">
        <Label htmlFor="settings-name">Название группы</Label>
        <Input id="settings-name" name="name" defaultValue={name} required />
      </div>
      <ActionFeedback state={state} />
      <SubmitButton variant="secondary" className="w-full" pendingLabel="Сохраняем...">
        Сохранить настройки
      </SubmitButton>
    </form>
  );
}
