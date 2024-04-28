import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";

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
      signIn: async ({ user }) => {
        if (!user.id) return false;

        const existingUser = await getUserById(user.id);

        if (!existingUser || !existingUser.emailVerified)
          return false;

        return true;
      },
      jwt: async ({ token }) => {
        if (token.sub) {
          const user = await getUserById(token.sub);
          console.log("user", user);
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
        if (token.role && user) {
          user.role = token.role as "USER" | "ADMIN";
        }

        return session;
      },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
  }
);
