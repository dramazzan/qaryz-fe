import { formatSignedMinorUnits, formatMinorUnits } from "@/lib/money";

type MoneyTotalListProps = {
  items: Array<{
    currencyCode: string;
    amountMinor: number;
  }>;
  signed?: boolean;
};

export function MoneyTotalList({ items, signed = false }: MoneyTotalListProps) {
  if (!items.length) {
    return <span className="text-sm text-muted-foreground">Баланса нет</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={`${item.currencyCode}:${item.amountMinor}`}
          className="rounded-md border border-border bg-card px-2 py-1 text-sm font-medium text-foreground"
        >
          {signed
            ? formatSignedMinorUnits(item.amountMinor, item.currencyCode)
            : formatMinorUnits(item.amountMinor, item.currencyCode)}
        </span>
      ))}
    </div>
  );
}
