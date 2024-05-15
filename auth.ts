import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

declare module "next-auth" {
  interface User {
    // Add your additional properties here:
    role?: "USER" | "ADMIN";
    isTwoFactorEnabled?: boolean;
    isOAuth?: boolean;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    // Add your additional properties here:
    role?: "USER" | "ADMIN";
    isTwoFactorEnabled?: boolean;
    isOAuth: boolean;
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
      signIn: async ({ user, account }) => {
        if (account?.provider !== "credentials")
          return true;

        if (!user.id) return false;

        const existingUser = await getUserById(user.id);

        // prevent login if account has not verified email
        if (!existingUser || !existingUser.emailVerified)
          return false;

        if (existingUser.isTwoFactorEnabled) {
          const confirmation =
            await getTwoFactorConfirmationByUserId(
              existingUser.id
            );

          if (!confirmation) return false;

          await db.twoFactorConfirmation.delete({
            where: { id: confirmation.id },
          });
        }

        return true;
      },
      jwt: async ({ token }) => {
        if (token.sub) {
          const user = await getUserById(token.sub);
          if (user) {
            const account = await getAccountByUserId(
              user.id
            );

            token.isOAuth = !!account;
            token.email = user.email;
            token.name = user.name;
            token.role = user.role;
            token.isTwoFactorEnabled =
              user.isTwoFactorEnabled;
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

        if (token.isTwoFactorEnabled && user) {
          user.isTwoFactorEnabled =
            token.isTwoFactorEnabled as boolean;
        }

        if (token.name && user.name) {
          user.name = token.name;
        }

        if (token.email && user.email) {
          user.email = token.email;
        }

        if (user) {
          user.isOAuth = token.isOAuth as boolean;
        }

        return session;
      },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
  }
);
