import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/bottom-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AppShellProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  unreadCount: number;
  children: ReactNode;
};

export function AppShell({ user, unreadCount, children }: AppShellProps) {
  const initials = (user.name ?? user.email ?? "Q")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <div className="px-4 pb-3 pt-[max(env(safe-area-inset-top),1.25rem)]">
          <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-3">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">Qaryz</p>
              <p className="text-sm text-muted-foreground">{user.name ?? user.email}</p>
            </div>
            <Avatar>
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "Профиль"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <main className="flex-1 px-4 pb-24">{children}</main>
        <BottomNav unreadCount={unreadCount} />
      </div>
    </div>
  );
}
