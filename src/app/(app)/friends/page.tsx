import { FriendAddForm } from "@/components/forms/friend-add-form";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/dates";
import { requireUser } from "@/lib/auth-helpers";
import { getFriendsData } from "@/lib/queries";

export default async function FriendsPage() {
  const user = await requireUser();
  const friends = await getFriendsData(user.id);

  return (
    <div className="space-y-5">
      <PageHeader title="Друзья" description="Добавляйте зарегистрированных пользователей и выбирайте их в личных долгах." />

      <Card>
        <CardHeader>
          <CardTitle>Добавить друга</CardTitle>
          <CardDescription>Нужен email аккаунта Qaryz.</CardDescription>
        </CardHeader>
        <CardContent>
          <FriendAddForm />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Ваши друзья</h2>
        {friends.length ? (
          <div className="grid gap-3">
            {friends.map((friend) => {
              const initials = friend.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <Card key={friend.id}>
                  <CardContent className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar>
                        <AvatarImage src={friend.image ?? undefined} alt={friend.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{friend.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{friend.email}</p>
                      </div>
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">{formatDate(friend.createdAt)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Друзей пока нет"
            description="Добавьте зарегистрированного пользователя по email, чтобы быстрее выбирать его в долгах."
          />
        )}
      </section>
    </div>
  );
}
