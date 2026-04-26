import type { ReactNode } from "react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="space-y-3 py-8 text-center">
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}

