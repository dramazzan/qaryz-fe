"use client";

import { useFormState } from "react-dom";

import { markNotificationRead } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import { initialActionState } from "@/lib/types";

export function NotificationReadForm({
  notificationId,
  isRead
}: {
  notificationId: string;
  isRead: boolean;
}) {
  const [, formAction] = useFormState(markNotificationRead, initialActionState);

  if (isRead) {
    return null;
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="notificationId" value={notificationId} />
      <Button type="submit" variant="ghost" size="sm">
        Прочитать
      </Button>
    </form>
  );
}
