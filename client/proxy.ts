import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const hasRefreshTokenError = req.auth?.error === "RefreshTokenError";
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  //redirect only if the user is on /dashboard route and not logged in or has refresh token error
  if (isDashboard && !(isLoggedIn || hasRefreshTokenError)) {
    const newUrl = new URL("/api/auth/signin", req.nextUrl.origin);

    // Callback url after keycloak login
    newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);

    return NextResponse.redirect(newUrl);
  }

  // Next stepm else
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
