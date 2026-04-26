import Link from "next/link";

import { HistoryClearForm } from "@/components/forms/history-clear-form";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/dates";
import { formatActivityEventType } from "@/lib/labels";
import { formatMinorUnits } from "@/lib/money";
import { requireUser } from "@/lib/auth-helpers";
import { listHistory } from "@/lib/queries";
import type { HistoryItem } from "@/lib/api-types";

function getHistoryKindLabel(item: HistoryItem) {
  return item.kind === "expense" ? "Группа" : "Личный";
}

export default async function HistoryPage() {
  const user = await requireUser();
  const items = await listHistory(user.id);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="История" description="Все созданные, обновлённые и погашенные записи по группам и личным долгам." />
        <HistoryClearForm disabled={!items.length} />
      </div>

      {items.length ? (
        <div className="grid gap-3">
          {items.map((item) => (
            <Link key={item.id} href={item.link}>
              <Card className="transition-transform hover:-translate-y-0.5">
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant={item.kind === "expense" ? "secondary" : "outline"}>
                        {getHistoryKindLabel(item)}
                      </Badge>
                      <Badge variant={item.eventType === "settled" ? "default" : "outline"}>
                        {formatActivityEventType(item.eventType)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDateTime(item.date)}</span>
                    <span>{formatMinorUnits(item.amountMinor, item.currencyCode)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Истории пока нет"
          description="Активность по расходам и долгам появится здесь, как только вы что-то создадите."
        />
      )}
    </div>
  );
}
