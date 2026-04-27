import { FriendAddForm } from "@/components/forms/friend-add-form";
import { PlatformUserFriendAction } from "@/components/forms/platform-user-friend-action";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/dates";
import { requireUser } from "@/lib/auth-helpers";
import { getFriendsData, getPlatformUsersData } from "@/lib/queries";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function FriendsPage() {
  const user = await requireUser();
  const [friends, platformUsers] = await Promise.all([
    getFriendsData(user.id),
    getPlatformUsersData(user.id)
  ]);

  return (
    <div className="space-y-5">
      <PageHeader title="Друзья" description="Добавляйте зарегистрированных пользователей и выбирайте их в личных долгах." />

      <Card>
        <CardHeader>
          <CardTitle>Добавить друга</CardTitle>
          <CardDescription>Можно ввести email или выбрать пользователя из списка ниже.</CardDescription>
        </CardHeader>
        <CardContent>
          <FriendAddForm />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Пользователи платформы</h2>
        {platformUsers.length ? (
          <div className="grid gap-3">
            {platformUsers.map((platformUser) => (
              <Card key={platformUser.id}>
                <CardContent className="flex items-center justify-between gap-3 space-y-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar>
                      <AvatarImage src={platformUser.image ?? undefined} alt={platformUser.name} />
                      <AvatarFallback>{getInitials(platformUser.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{platformUser.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{platformUser.email}</p>
                    </div>
                  </div>
                  <PlatformUserFriendAction userId={platformUser.id} isFriend={platformUser.isFriend} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Других пользователей пока нет"
            description="Когда на платформе появятся новые аккаунты, они будут отображаться здесь."
          />
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Ваши друзья</h2>
        {friends.length ? (
          <div className="grid gap-3">
            {friends.map((friend) => (
              <Card key={friend.id}>
                <CardContent className="flex items-center justify-between gap-3 space-y-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar>
                      <AvatarImage src={friend.image ?? undefined} alt={friend.name} />
                      <AvatarFallback>{getInitials(friend.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{friend.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{friend.email}</p>
                    </div>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">{formatDate(friend.createdAt)}</p>
                </CardContent>
              </Card>
            ))}
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
