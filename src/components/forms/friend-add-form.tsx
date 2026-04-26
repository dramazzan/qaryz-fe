"use client";

import { useFormState } from "react-dom";

import { addFriend } from "@/actions/friends";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialActionState } from "@/lib/types";

export function FriendAddForm() {
  const [state, formAction] = useFormState(addFriend, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="friend-email">Email</Label>
        <Input id="friend-email" name="email" type="email" placeholder="friend@example.com" required />
      </div>
      <ActionFeedback state={state} />
      <SubmitButton className="w-full" size="lg" pendingLabel="Добавляем...">
        Добавить друга
      </SubmitButton>
    </form>
  );
}
