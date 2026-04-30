"use client";

import { useFormState } from "react-dom";

import { createDirectDebt } from "@/actions/debts";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_CURRENCY_CODE } from "@/lib/money";
import { cn } from "@/lib/utils";
import { initialActionState } from "@/lib/types";

type DirectDebtFormProps = {
  contacts: Array<{
    id: string;
    name: string;
    email: string;
  }>;
};

export function DirectDebtForm({ contacts }: DirectDebtFormProps) {
  const [state, formAction] = useFormState(createDirectDebt, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="currencyCode" value={DEFAULT_CURRENCY_CODE} />

      <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-secondary/50 p-1">
        <label className="cursor-pointer">
          <input type="radio" name="direction" value="owed_to_me" defaultChecked className="peer sr-only" />
          <span className="flex h-10 items-center justify-center rounded-md text-sm font-medium text-muted-foreground peer-checked:bg-card peer-checked:text-foreground">
            Мне должны
          </span>
        </label>
        <label className="cursor-pointer">
          <input type="radio" name="direction" value="i_owe" className="peer sr-only" />
          <span className="flex h-10 items-center justify-center rounded-md text-sm font-medium text-muted-foreground peer-checked:bg-card peer-checked:text-foreground">
            Я должен
          </span>
        </label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="debt-title">Название</Label>
        <Input id="debt-title" name="title" placeholder="Такси обратно" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="debt-amount">Сумма</Label>
        <Input id="debt-amount" name="amount" inputMode="decimal" placeholder="2500" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="debt-date">Дата</Label>
        <Input id="debt-date" name="debtDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="debt-contact">Пользователь платформы</Label>
        <select
          id="debt-contact"
          name="borrowerId"
          defaultValue=""
          className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm"
        >
          <option value="">Выберите пользователя</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name} {contact.email ? `(${contact.email})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="debt-external-name">Имя без аккаунта</Label>
        <Input id="debt-external-name" name="externalCounterpartyName" placeholder="Айдар" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="debt-note">Заметка</Label>
        <Textarea id="debt-note" name="note" placeholder="Необязательная информация" className={cn("min-h-[96px]")} />
      </div>

      <ActionFeedback state={state} />
      <SubmitButton className="w-full" size="lg" pendingLabel="Сохраняем долг...">
        Добавить личный долг
      </SubmitButton>
    </form>
  );
}
