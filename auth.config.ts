import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";
import { LoginFormSchema } from "./schemas";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./data/user";

export default {
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validFields =
          LoginFormSchema.safeParse(credentials);

        if (validFields.success) {
          const { email, password } = validFields.data;
          const user = await getUserByEmail(email);

          if (!user || !user?.password) return null;

          const hasConfirmedPassword = await bcrypt.compare(
            password,
            user.password
          );

          if (hasConfirmedPassword) {
            return user;
          }
        }
        // const response = await fetch(request);
        // if (!response.ok) return null;
        // return (await response.json()) ?? null;
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
