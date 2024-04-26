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
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
    },
    events: {
      async linkAccount({ user }) {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      },
    },
    callbacks: {
      jwt: async ({ token }) => {
        if (token.email) {
          const user = await getUserByEmail(token.email);
          if (user) {
            token.role = user.role;
          }
        }
        return token;
      },
      session: ({ session, token }) => {
        const user = session.user;
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.role && session.user) {
          session.user.role = token.role as
            | "USER"
            | "ADMIN";
        }

        return session;
      },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
  }
);
