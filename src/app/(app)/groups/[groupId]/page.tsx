import { notFound } from "next/navigation";

import { GroupSettingsForm } from "@/components/forms/group-settings-form";
import { InviteRotateForm } from "@/components/forms/invite-rotate-form";
import { MemberRoleForm } from "@/components/forms/member-role-form";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/dates";
import { formatGroupRole } from "@/lib/labels";
import { formatMinorUnits } from "@/lib/money";
import { requireUser } from "@/lib/auth-helpers";
import { getGroupDetailData } from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

export default async function GroupDetailPage({
  params
}: {
  params: { groupId: string };
}) {
  const user = await requireUser();
  const group = await getGroupDetailData(user.id, params.groupId);

  if (!group) {
    notFound();
  }

  const canManage = group.viewerRole === "OWNER" || group.viewerRole === "ADMIN";
  const inviteLink = group.inviteCode ? absoluteUrl(`/groups?invite=${group.inviteCode}`) : null;

  return (
    <div className="space-y-5">
      <PageHeader title={group.name} description={`Общие расходы в ${group.currencyCode}.`} />

      <Card>
        <CardHeader>
          <CardTitle>Пригласить участников</CardTitle>
          <CardDescription>
            Поделитесь текущим кодом или ссылкой. После обновления старый код сразу перестанет работать.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-secondary/40 p-3">
            <p className="text-xs font-medium uppercase text-muted-foreground">Активный код</p>
            <p className="mt-2 font-display text-2xl font-semibold">{group.inviteCode ?? "Создайте код"}</p>
            {inviteLink ? (
              <p className="mt-3 break-all text-sm text-muted-foreground">{inviteLink}</p>
            ) : null}
          </div>
          {canManage ? <InviteRotateForm groupId={group.id} /> : null}
        </CardContent>
      </Card>

      {canManage ? (
        <Card>
          <CardHeader>
            <CardTitle>Настройки</CardTitle>
            <CardDescription>Поддерживайте название актуальным.</CardDescription>
          </CardHeader>
          <CardContent>
            <GroupSettingsForm
              groupId={group.id}
              name={group.name}
              currencyCode={group.currencyCode}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Участники</CardTitle>
          <CardDescription>Владелец и админы могут управлять ролями и составом группы.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {group.members.map((member) => {
            const initials = member.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            const disabled =
              !canManage ||
              member.userId === user.id ||
              (group.viewerRole === "ADMIN" && member.role === "ADMIN");

            return (
              <div key={member.id} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={member.image ?? undefined} alt={member.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{member.name}</p>
                      <Badge variant={member.role === "OWNER" ? "default" : "outline"}>
                        {formatGroupRole(member.role)}
                      </Badge>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <MemberRoleForm groupId={group.id} memberId={member.id} role={member.role} disabled={disabled} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Последние расходы</h2>
        <div className="grid gap-3">
          {group.expenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Оплатил(а) {expense.payer.name ?? expense.payer.email ?? "Участник"}
                    </p>
                  </div>
                  <Badge>{formatMinorUnits(expense.amountMinor, expense.currencyCode)}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(expense.expenseDate)}</span>
                  <span>{expense.participants.length} participants</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {!group.expenses.length ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                В этой группе пока нет расходов.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  );
}
