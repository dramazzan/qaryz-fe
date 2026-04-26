"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { Camera, CheckCircle2, Users } from "lucide-react";

import { createExpense } from "@/actions/expenses";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { initialActionState } from "@/lib/types";

type SharedExpenseFormProps = {
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
  defaultGroupId?: string;
};

export function SharedExpenseForm({ groups, defaultGroupId }: SharedExpenseFormProps) {
  const [state, formAction] = useFormState(createExpense, initialActionState);
  const [selectedGroupId, setSelectedGroupId] = useState(defaultGroupId ?? groups[0]?.id ?? "");
  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? groups[0],
    [groups, selectedGroupId]
  );
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (selectedGroup) {
      setSelectedParticipants(selectedGroup.members.map((member) => member.id));
    }
  }, [selectedGroup]);

  if (!selectedGroup) {
    return <p className="text-sm text-muted-foreground">Сначала создайте группу, чтобы добавить общий расход.</p>;
  }

  function toggleParticipant(userId: string) {
    setSelectedParticipants((current) =>
      current.includes(userId) ? current.filter((item) => item !== userId) : [...current, userId]
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="expense-group">Группа</Label>
          <select
            id="expense-group"
            name="groupId"
            value={selectedGroupId}
            onChange={(event) => setSelectedGroupId(event.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm"
          >
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.currencyCode})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="expense-amount">Сумма</Label>
          <Input id="expense-amount" name="amount" inputMode="decimal" placeholder="18.40" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expense-title">Название</Label>
        <Input id="expense-title" name="title" placeholder="Продукты" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expense-date">Дата</Label>
        <Input id="expense-date" name="expenseDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Разделить с</Label>
          <span className="text-xs text-muted-foreground">{selectedGroup.currencyCode}</span>
        </div>
        <div className="grid gap-2">
          {selectedGroup.members.map((member) => {
            const checked = selectedParticipants.includes(member.id);

            return (
              <label
                key={member.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors",
                  checked ? "border-primary bg-primary/5" : "border-border bg-card"
                )}
              >
                <span className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {member.name}
                </span>
                <span className="flex items-center gap-2">
                  {checked ? <CheckCircle2 className="h-4 w-4 text-primary" /> : null}
                  <input
                    type="checkbox"
                    name="participantIds"
                    value={member.id}
                    checked={checked}
                    onChange={() => toggleParticipant(member.id)}
                    className="sr-only"
                  />
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <details className="rounded-lg border border-dashed border-border bg-card px-3 py-2.5">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-foreground">
          <Camera className="h-4 w-4" />
          Добавить заметку или чек
        </summary>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense-note">Заметка</Label>
            <Textarea id="expense-note" name="note" placeholder="Необязательная информация" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-receipt">Фото чека</Label>
            <Input id="expense-receipt" name="receipt" type="file" accept="image/*" />
          </div>
        </div>
      </details>

      <ActionFeedback state={state} />
      <SubmitButton className="w-full" size="lg" pendingLabel="Добавляем расход...">
        Добавить общий расход
      </SubmitButton>
    </form>
  );
}
