import { Chrome } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPublicBackendUrl } from "@/lib/backend-api";

export function GoogleSignInButton() {
  const googleAuthUrl = getPublicBackendUrl("/auth/google");

  return (
    <Button size="lg" className="w-full" asChild>
      <a href={googleAuthUrl}>
        <Chrome className="mr-2 h-5 w-5" />
        Продолжить через Google
      </a>
    </Button>
  );
}
