"use client";

import { Check, UserPlus } from "lucide-react";
import { useFormState } from "react-dom";

import { addFriend } from "@/actions/friends";
import { SubmitButton } from "@/components/forms/submit-button";
import { Badge } from "@/components/ui/badge";
import { initialActionState } from "@/lib/types";

type PlatformUserFriendActionProps = {
  userId: string;
  isFriend: boolean;
};

export function PlatformUserFriendAction({ userId, isFriend }: PlatformUserFriendActionProps) {
  const [state, formAction] = useFormState(addFriend, initialActionState);

  if (isFriend) {
    return (
      <Badge variant="secondary" className="shrink-0 gap-1.5">
        <Check className="h-3.5 w-3.5" />
        В друзьях
      </Badge>
    );
  }

  return (
    <form action={formAction} className="flex shrink-0 flex-col items-end gap-2">
      <input type="hidden" name="userId" value={userId} />
      <SubmitButton variant="outline" size="sm" pendingLabel="Добавляем..." className="gap-1.5">
        <UserPlus className="h-4 w-4" />
        Добавить
      </SubmitButton>
      {state.status === "error" && state.message ? (
        <p className="max-w-44 text-right text-xs text-destructive">{state.message}</p>
      ) : null}
    </form>
  );
}
