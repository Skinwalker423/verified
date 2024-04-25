import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "./lib/db";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth(
  {
    callbacks: {
      jwt: async ({ token }) => {
        return { token };
      },
      session: ({ session, token }) => {
        console.log("session", session);
        console.log({ token });
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }

        return session;
      },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
  }
);
