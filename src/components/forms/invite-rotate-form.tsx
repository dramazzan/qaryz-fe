"use client";

import { useFormState } from "react-dom";

import { rotateGroupInvite } from "@/actions/groups";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { initialActionState } from "@/lib/types";

export function InviteRotateForm({ groupId }: { groupId: string }) {
  const [state, formAction] = useFormState(rotateGroupInvite, initialActionState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="groupId" value={groupId} />
      <ActionFeedback state={state} />
      <SubmitButton variant="outline" className="w-full" pendingLabel="Обновляем код...">
        Обновить код приглашения
      </SubmitButton>
    </form>
  );
}
