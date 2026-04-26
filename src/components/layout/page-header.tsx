import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("space-y-1", className)}>
      <h1 className="font-display text-2xl font-semibold leading-tight text-foreground">{title}</h1>
      {description ? <p className="max-w-md text-sm text-muted-foreground">{description}</p> : null}
    </header>
  );
}
