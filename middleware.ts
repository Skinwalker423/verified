import authConfig from "./auth.config";
import NextAuth from "next-auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  authPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // req.auth
  const { nextUrl, auth } = req;

  const isLoggedIn = !!auth;
  const currentPath = nextUrl.pathname;

  const isApiAuthRoute = currentPath.startsWith(authPrefix);
  const isAuthRoute = authRoutes.includes(currentPath);
  const isPublicRoute = publicRoutes.includes(currentPath);

  if (isApiAuthRoute) return;
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)
      );
    } else {
      return;
    }
  }

  if (!isPublicRoute) {
    return Response.redirect(
      new URL("auth/login", nextUrl)
    );
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
