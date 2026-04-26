import { Chrome } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPublicBackendUrl } from "@/lib/backend-api";

type GoogleSignInButtonProps = {
  returnTo?: string;
};

export function GoogleSignInButton({ returnTo = "/" }: GoogleSignInButtonProps) {
  const query = returnTo === "/" ? "" : `?${new URLSearchParams({ returnTo }).toString()}`;
  const googleAuthUrl = getPublicBackendUrl(`/auth/google${query}`);

  return (
    <Button size="lg" className="w-full" asChild>
      <a href={googleAuthUrl}>
        <Chrome className="mr-2 h-5 w-5" />
        Продолжить через Google
      </a>
    </Button>
  );
}
