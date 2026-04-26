"use client";

import { useFormState } from "react-dom";

import { removeGroupMember, updateGroupMemberRole } from "@/actions/groups";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatGroupRole } from "@/lib/labels";
import { initialActionState } from "@/lib/types";

type MemberRoleFormProps = {
  groupId: string;
  memberId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  disabled: boolean;
};

export function MemberRoleForm({ groupId, memberId, role, disabled }: MemberRoleFormProps) {
  const [roleState, roleAction] = useFormState(updateGroupMemberRole, initialActionState);
  const [removeState, removeAction] = useFormState(removeGroupMember, initialActionState);

  if (role === "OWNER") {
    return <Badge>{formatGroupRole(role)}</Badge>;
  }

  return (
    <div className="space-y-2">
      <form action={roleAction} className="flex items-center gap-2">
        <input type="hidden" name="groupId" value={groupId} />
        <input type="hidden" name="memberId" value={memberId} />
        <select
          name="role"
          defaultValue={role}
          disabled={disabled}
          className="h-10 flex-1 rounded-lg border border-input bg-card px-3 text-sm"
        >
          <option value="MEMBER">Участник</option>
          <option value="ADMIN">Админ</option>
        </select>
        <SubmitButton size="sm" variant="outline" pendingLabel="Сохраняем..." disabled={disabled}>
          Сохранить
        </SubmitButton>
      </form>
      <form action={removeAction}>
        <input type="hidden" name="groupId" value={groupId} />
        <input type="hidden" name="memberId" value={memberId} />
        <Button type="submit" variant="ghost" size="sm" disabled={disabled} className="w-full text-destructive">
          Удалить
        </Button>
      </form>
      <ActionFeedback state={roleState.status === "error" ? roleState : removeState} />
    </div>
  );
}
