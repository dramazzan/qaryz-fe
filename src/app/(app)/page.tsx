import Link from "next/link";
import { ArrowRight, ReceiptText, WalletCards } from "lucide-react";

import { EmptyState } from "@/components/layout/empty-state";
import { MoneyTotalList } from "@/components/layout/money-total-list";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/dates";
import { formatMinorUnits } from "@/lib/money";
import { requireUser } from "@/lib/auth-helpers";
import { getDashboardData } from "@/lib/queries";
import type { BalanceEntry } from "@/lib/api-types";

function getEntryKindLabel(entry: BalanceEntry) {
  return entry.sourceType === "expense" ? "Группа" : "Личный";
}

function getEntryPartyText(entry: BalanceEntry) {
  return `${entry.debtorName} должен(на) ${entry.creditorName}`;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <div className="space-y-5">
      <PageHeader title="Баланс" description="Смотрите, кому должны вы, кто должен вам, и последние действия." />

      <Card className="overflow-hidden">
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Итоговый баланс</p>
            <div className="mt-3">
              <MoneyTotalList items={data.summary.net} signed />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-secondary/40 p-3">
              <p className="text-xs font-medium uppercase text-muted-foreground">Должны вам</p>
              <div className="mt-3">
                <MoneyTotalList items={data.summary.owedToYou} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-secondary/40 p-3">
              <p className="text-xs font-medium uppercase text-muted-foreground">Должны вы</p>
              <div className="mt-3">
                <MoneyTotalList items={data.summary.youOwe} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Люди</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/history">
              Вся история
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {data.summary.counterparties.length ? (
          <div className="grid gap-3">
            {data.summary.counterparties.map((entry) => {
              const initials = entry.counterpartyName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <Card key={`${entry.counterpartyId}-${entry.currencyCode}`}>
                  <CardContent className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={entry.counterpartyImage ?? undefined} alt={entry.counterpartyName} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{entry.counterpartyName}</p>
                        <p className="text-sm text-muted-foreground">{entry.currencyCode}</p>
                      </div>
                    </div>
                    <Badge variant={entry.netAmountMinor >= 0 ? "default" : "destructive"}>
                      {entry.netAmountMinor >= 0 ? "должен вам" : "вы должны"}{" "}
                      {formatMinorUnits(Math.abs(entry.netAmountMinor), entry.currencyCode)}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Нет открытых балансов"
            description="Добавьте первый общий расход или личный долг, чтобы начать учёт."
            action={
              <Button asChild>
                <Link href="/add">Добавить запись</Link>
              </Button>
            }
          />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Открытые записи</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/groups">
              Группы
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {data.entries.length ? (
          <div className="grid gap-3">
            {data.entries.slice(0, 8).map((entry) => (
              <Link key={entry.id} href={entry.link}>
                <Card className="transition-transform hover:-translate-y-0.5">
                  <CardContent className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {entry.sourceType === "expense" ? (
                          <ReceiptText className="h-4 w-4 text-primary" />
                        ) : (
                          <WalletCards className="h-4 w-4 text-primary" />
                        )}
                        <p className="font-medium">{entry.title}</p>
                        <Badge
                          variant={entry.sourceType === "expense" ? "secondary" : "outline"}
                          className="shrink-0 px-2 py-0.5"
                        >
                          {getEntryKindLabel(entry)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{getEntryPartyText(entry)}</p>
                      {entry.groupName ? (
                        <p className="text-xs text-muted-foreground">Группа · {entry.groupName}</p>
                      ) : null}
                      <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
                    </div>
                    <Badge variant={entry.direction === "owedToYou" ? "default" : "outline"}>
                      {entry.direction === "owedToYou" ? "+" : "-"}
                      {formatMinorUnits(entry.amountMinor, entry.currencyCode)}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
