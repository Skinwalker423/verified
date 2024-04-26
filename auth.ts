import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "./lib/db";
import authConfig from "./auth.config";
import { getUserByEmail } from "./data/user";

declare module "next-auth" {
  interface User {
    // Add your additional properties here:
    role?: "USER" | "ADMIN";
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    // Add your additional properties here:
    role?: "USER" | "ADMIN";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(
  {
    callbacks: {
      jwt: async ({ token }) => {
        console.log("jwt", token);
        if (token.email) {
          const user = await getUserByEmail(token.email);
          if (user) {
            token.role = user.role;
          }
        }
        return token;
      },
      session: ({ session, token }) => {
        console.log({ token });
        const user = session.user;
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.role && session.user) {
          session.user.role = token.role as
            | "USER"
            | "ADMIN";
        }

        console.log("session", session);
        return session;
      },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
  }
);
