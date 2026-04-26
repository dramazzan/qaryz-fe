import { Bell, Users } from "lucide-react";

import { NotificationReadForm } from "@/components/forms/notification-read-form";
import { SignOutForm } from "@/components/forms/sign-out-form";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/dates";
import { requireUser } from "@/lib/auth-helpers";
import { getProfileData } from "@/lib/queries";

export default async function ProfilePage() {
  const sessionUser = await requireUser();
  const data = await getProfileData(sessionUser.id);

  if (!data.user) {
    return null;
  }

  const initials = (data.user.name ?? data.user.email ?? "Q")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-5">
      <PageHeader title="Профиль" description="Ваш аккаунт, уведомления и участие в группах." />

      <Card>
        <CardContent className="space-y-4 py-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 rounded-lg">
              <AvatarImage src={data.user.image ?? undefined} alt={data.user.name ?? "Профиль"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{data.user.name ?? "Пользователь без имени"}</p>
              <p className="text-sm text-muted-foreground">{data.user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-secondary/40 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                Группы
              </div>
              <p className="mt-2 text-2xl font-semibold">{data.memberships.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/40 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bell className="h-4 w-4" />
                Новые
              </div>
              <p className="mt-2 text-2xl font-semibold">{data.unreadCount}</p>
            </div>
          </div>
          <SignOutForm />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Уведомления</h2>
        <div className="grid gap-3">
          {data.notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  <Badge variant={notification.readAt ? "outline" : "default"}>
                    {notification.readAt ? "прочитано" : "новое"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDateTime(notification.createdAt)}</span>
                  <NotificationReadForm notificationId={notification.id} isRead={Boolean(notification.readAt)} />
                </div>
              </CardContent>
            </Card>
          ))}
          {!data.notifications.length ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Здесь появятся уведомления, когда кто-то добавит, обновит или погасит долг.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  );
}
