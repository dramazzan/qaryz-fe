"use client";

import { useState } from "react";

import { DirectDebtForm } from "@/components/forms/direct-debt-form";
import { SharedExpenseForm } from "@/components/forms/shared-expense-form";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AddEntryPanelProps = {
  groups: Array<{
    id: string;
    name: string;
    currencyCode: string;
    members: Array<{
      id: string;
      name: string;
      image?: string | null;
    }>;
  }>;
  contacts: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  defaultGroupId?: string;
  defaultCurrencyCode: string;
};

export function AddEntryPanel({
  groups,
  contacts,
  defaultGroupId,
  defaultCurrencyCode
}: AddEntryPanelProps) {
  const [mode, setMode] = useState<"expense" | "debt">("expense");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-secondary/50 p-1">
        <button
          type="button"
          onClick={() => setMode("expense")}
          className={cn(
            "h-10 rounded-md text-sm font-medium transition-colors",
            mode === "expense" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          Общий расход
        </button>
        <button
          type="button"
          onClick={() => setMode("debt")}
          className={cn(
            "h-10 rounded-md text-sm font-medium transition-colors",
            mode === "debt" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          Личный долг
        </button>
      </div>

      <Card>
        <CardContent>
          {mode === "expense" ? (
            <SharedExpenseForm groups={groups} defaultGroupId={defaultGroupId} />
          ) : (
            <DirectDebtForm contacts={contacts} defaultCurrencyCode={defaultCurrencyCode} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
