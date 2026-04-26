import Link from "next/link";

import { GroupCreateForm } from "@/components/forms/group-create-form";
import { JoinGroupForm } from "@/components/forms/join-group-form";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/dates";
import { formatGroupRole } from "@/lib/labels";
import { requireUser } from "@/lib/auth-helpers";
import { getGroupsData } from "@/lib/queries";

export default async function GroupsPage({
  searchParams
}: {
  searchParams: { invite?: string };
}) {
  const user = await requireUser();
  const groups = await getGroupsData(user.id);

  return (
    <div className="space-y-5">
      <PageHeader title="Группы" description="Создавайте небольшие круги, делитесь кодом приглашения и храните все расходы вместе." />

      <Card className={searchParams.invite ? "border-primary" : undefined}>
        <CardHeader>
          <CardTitle>Вступить в группу</CardTitle>
          <CardDescription>
            {searchParams.invite
              ? "Этот код пришёл из ссылки. Если он ещё активен, вы войдёте сразу."
              : "Вставьте код приглашения, чтобы присоединиться к доверенной группе."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JoinGroupForm inviteCode={searchParams.invite} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Создать новую группу</CardTitle>
          <CardDescription>Одна валюта на группу делает расчёты простыми и понятными.</CardDescription>
        </CardHeader>
        <CardContent>
          <GroupCreateForm />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Ваши группы</h2>
        {groups.length ? (
          <div className="grid gap-3">
            {groups.map((group) => (
              <Link key={group.id} href={`/groups/${group.id}`}>
                <Card className="transition-transform hover:-translate-y-0.5">
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{group.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {group.memberCount} участн. · {group.currencyCode}
                        </p>
                      </div>
                      <Badge>{formatGroupRole(group.role)}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{group.inviteCode ? `Код ${group.inviteCode}` : "Кода пока нет"}</span>
                      <span>{group.lastExpenseAt ? `Последний расход ${formatDate(group.lastExpenseAt)}` : "Расходов пока нет"}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Групп пока нет"
            description="Создайте группу для дома, поездки или друзей и начните вести общие расходы."
          />
        )}
      </section>
    </div>
  );
}
