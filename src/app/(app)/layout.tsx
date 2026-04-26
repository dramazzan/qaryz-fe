import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth-helpers";
import { getUnreadNotificationCount } from "@/lib/queries";

export default async function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const unreadCount = await getUnreadNotificationCount(user.id);

  return (
    <AppShell user={user} unreadCount={unreadCount}>
      {children}
    </AppShell>
  );
}

