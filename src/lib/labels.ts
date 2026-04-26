import type { DirectDebtStatus, ExpenseParticipantStatus, GroupRole } from "@prisma/client";

import type { ActivityEventType } from "@/lib/types";

export function formatGroupRole(role: GroupRole) {
  switch (role) {
    case "OWNER":
      return "владелец";
    case "ADMIN":
      return "админ";
    case "MEMBER":
      return "участник";
  }
}

export function formatActivityEventType(eventType: ActivityEventType) {
  switch (eventType) {
    case "created":
      return "создано";
    case "updated":
      return "обновлено";
    case "settled":
      return "погашено";
  }
}

export function formatDebtStatus(status: DirectDebtStatus) {
  switch (status) {
    case "OPEN":
      return "активен";
    case "SETTLED":
      return "погашен";
  }
}

export function formatExpenseParticipantStatus(
  status: ExpenseParticipantStatus,
  isPayer: boolean
) {
  if (isPayer) {
    return "плательщик";
  }

  switch (status) {
    case "OPEN":
      return "открыто";
    case "SETTLED":
      return "погашено";
  }
}

