// import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";
import { LoginFormSchema } from "./schemas";
import bcrypt from "bcrypt";
import { getUserByEmail } from "./data/user";

export default {
  providers: [
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

          const hasConfirmedPassword = bcrypt.compare(
            password,
            user.password
          );

          if (!hasConfirmedPassword) {
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
