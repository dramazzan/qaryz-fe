import Image from "next/image";
import { notFound } from "next/navigation";

import { DirectDebtEditForm } from "@/components/forms/direct-debt-edit-form";
import { SettleDirectDebtForm } from "@/components/forms/settle-direct-debt-form";
import { SettleExpenseShareForm } from "@/components/forms/settle-expense-share-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateTime } from "@/lib/dates";
import {
  formatDebtStatus,
  formatExpenseParticipantStatus
} from "@/lib/labels";
import { formatMinorUnits } from "@/lib/money";
import { requireUser } from "@/lib/auth-helpers";
import { getDirectDebtDetail, getExpenseDetail } from "@/lib/queries";
import type { ApiUser, DirectDebtDetail } from "@/lib/api-types";

function displayUserName(user: ApiUser | null | undefined, fallback: string) {
  return user?.name ?? user?.email ?? fallback;
}

function getExternalDebtName(debt: NonNullable<DirectDebtDetail>) {
  return debt.externalCounterpartyName ?? debt.externalCounterpartyEmail ?? "Человек";
}

function getDebtCounterpartyName(debt: NonNullable<DirectDebtDetail>, userId: string) {
  const externalName = getExternalDebtName(debt);

  return debt.lenderId === userId
    ? displayUserName(debt.borrower, externalName)
    : displayUserName(debt.lender, externalName);
}

export default async function ActivityDetailPage({
  params
}: {
  params: { kind: string; id: string };
}) {
  const user = await requireUser();

  if (params.kind === "expense") {
    const expense = await getExpenseDetail(user.id, params.id);

    if (!expense) {
      notFound();
    }

    const canSettleFor = (participantUserId: string) =>
      participantUserId === user.id || expense.payerId === user.id;

    return (
      <div className="space-y-5">
        <PageHeader title={expense.title} description={`${expense.group.name} · ${formatDate(expense.expenseDate)}`} />

        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Итого</p>
                <p className="mt-2 font-display text-3xl font-semibold">{formatMinorUnits(expense.amountMinor, expense.currencyCode)}</p>
              </div>
              <Badge>{expense.currencyCode}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="text-xs font-medium uppercase">Оплатил(а)</p>
                <p className="mt-1 text-foreground">{expense.payer.name ?? expense.payer.email ?? "Участник"}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase">Создано</p>
                <p className="mt-1 text-foreground">{formatDateTime(expense.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {expense.note ? (
          <Card>
            <CardHeader>
              <CardTitle>Заметка</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{expense.note}</p>
            </CardContent>
          </Card>
        ) : null}

        {expense.receiptUrl ? (
          <Card>
            <CardHeader>
              <CardTitle>Чек</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={expense.receiptUrl}
                alt={expense.title}
                width={1400}
                height={1000}
                unoptimized
                className="w-full rounded-lg border border-border object-cover"
              />
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Участники</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {expense.participants.map((participant) => (
              <div key={participant.id} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{participant.user.name ?? participant.user.email ?? "Участник"}</p>
                    <p className="text-sm text-muted-foreground">
                      Доля: {formatMinorUnits(participant.shareMinor, expense.currencyCode)}
                    </p>
                  </div>
                  <Badge variant={participant.status === "SETTLED" ? "default" : "outline"}>
                    {formatExpenseParticipantStatus(participant.status, participant.userId === expense.payerId)}
                  </Badge>
                </div>
                {participant.userId !== expense.payerId ? (
                  <div className="mt-4">
                    {participant.status === "OPEN" && canSettleFor(participant.userId) ? (
                      <SettleExpenseShareForm participantId={participant.id} />
                    ) : participant.status === "SETTLED" ? (
                      <p className="text-xs text-muted-foreground">
                        Погашено {participant.settledAt ? formatDateTime(participant.settledAt) : ""}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (params.kind === "debt") {
    const debt = await getDirectDebtDetail(user.id, params.id);

    if (!debt) {
      notFound();
    }

    const counterparty = getDebtCounterpartyName(debt, user.id);
    const externalName = getExternalDebtName(debt);
    const borrowerName = displayUserName(debt.borrower, debt.borrowerId ? "Кто-то" : externalName);
    const lenderName = displayUserName(debt.lender, debt.lenderId ? "кому-то" : externalName);

    return (
      <div className="space-y-5">
        <PageHeader title={debt.title} description={`С ${counterparty} · ${formatDate(debt.debtDate)}`} />

        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Сумма</p>
                <p className="mt-2 font-display text-3xl font-semibold">{formatMinorUnits(debt.amountMinor, debt.currencyCode)}</p>
              </div>
              <Badge variant={debt.status === "SETTLED" ? "default" : "outline"}>
                {formatDebtStatus(debt.status)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {borrowerName} должен(на) {lenderName}.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Детали</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Создано</span>
              <span>{formatDateTime(debt.createdAt)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Последнее обновление</span>
              <span>{formatDateTime(debt.updatedAt)}</span>
            </div>
            {debt.note ? (
              <>
                <Separator />
                <div className="space-y-1">
                  <span className="text-muted-foreground">Заметка</span>
                  <p>{debt.note}</p>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        {debt.status === "OPEN" ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Изменить долг</CardTitle>
              </CardHeader>
              <CardContent>
                <DirectDebtEditForm debt={debt} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Погасить</CardTitle>
              </CardHeader>
              <CardContent>
                <SettleDirectDebtForm debtId={debt.id} />
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-5 text-sm text-muted-foreground">
              Погашено {debt.settledAt ? formatDateTime(debt.settledAt) : ""}.
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  notFound();
}
