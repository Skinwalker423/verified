import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "./lib/db";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth(
  {
    adapter: PrismaAdapter(db),
    providers: [GitHub],
  }
);
