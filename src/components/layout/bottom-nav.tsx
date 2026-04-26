"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CirclePlus, History, Home, Shapes, UserRound, UsersRound } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/groups", label: "Группы", icon: Shapes },
  { href: "/friends", label: "Друзья", icon: UsersRound },
  { href: "/history", label: "История", icon: History },
  { href: "/profile", label: "Профиль", icon: UserRound }
];

export function BottomNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <>
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-4">
        <Link
          href="/add"
          aria-label="Добавить запись"
          className={cn(
            "ml-auto flex h-12 w-12 items-center justify-center rounded-lg border border-primary bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5",
            pathname === "/add" && "bg-foreground"
          )}
        >
          <CirclePlus className="h-6 w-6" />
        </Link>
      </div>

      <nav className="sticky bottom-0 z-20 border-t border-border bg-card px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex min-h-[56px] flex-col items-center justify-center rounded-md text-[11px] font-medium transition-colors",
                  active ? "bg-secondary text-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className="mb-1 h-5 w-5" />
                {item.label}
                {item.href === "/profile" && unreadCount > 0 ? (
                  <span className="absolute right-3 top-2 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
