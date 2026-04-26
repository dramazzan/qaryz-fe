import { redirect } from "next/navigation";

import { GoogleSignInButton } from "@/components/forms/google-sign-in-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOptionalUser } from "@/lib/auth-helpers";

export default async function LoginPage() {
  const user = await getOptionalUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-sm flex-col justify-between">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase text-primary">Qaryz</p>
          <h1 className="font-display text-3xl font-semibold leading-tight text-foreground">
            Общие деньги, <br />
            ясные балансы.
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Делите счета, ведите личные долги и сразу видьте, кто кому должен.
          </p>
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Вход</CardTitle>
            <CardDescription>Войдите через Google, чтобы открыть свой профиль и группы.</CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleSignInButton />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
