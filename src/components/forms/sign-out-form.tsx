import { LogOut } from "lucide-react";

import { signOutUser } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";

export function SignOutForm() {
  return (
    <form action={signOutUser}>
      <Button type="submit" variant="outline" className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        Выйти
      </Button>
    </form>
  );
}
