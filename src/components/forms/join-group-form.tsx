"use client";

import { useFormState } from "react-dom";

import { joinGroupByCode } from "@/actions/groups";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialActionState } from "@/lib/types";

export function JoinGroupForm({ inviteCode }: { inviteCode?: string }) {
  const [state, formAction] = useFormState(joinGroupByCode, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="invite-code">Код приглашения</Label>
        <Input id="invite-code" name="inviteCode" defaultValue={inviteCode} placeholder="AB12CD34" required />
      </div>
      <ActionFeedback state={state} />
      <SubmitButton className="w-full" size="lg" pendingLabel="Вступаем...">
        Вступить в группу
      </SubmitButton>
    </form>
  );
}
