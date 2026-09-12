"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

function SessionExpiryHandler() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSigningOut = useRef(false);

  useEffect(() => {
    if (session?.error !== "RefreshTokenError" || isSigningOut.current) {
      return;
    }

    isSigningOut.current = true;
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;
    const callbackUrl = `/login?callbackUrl=${encodeURIComponent(currentUrl)}`;
    void signOut({ callbackUrl });
  }, [pathname, searchParams, session?.error]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={60} refetchOnWindowFocus>
      <SessionExpiryHandler />
      {children}
    </SessionProvider>
  );
}
