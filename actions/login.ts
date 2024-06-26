"use server";

import { signIn } from "@/auth";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import {
  sendVerificationEmail,
  sendTwoFactorTokenConfirmationEmail,
} from "@/lib/mail";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginFormSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import brcypt from "bcrypt";
import db from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (
  values: z.infer<typeof LoginFormSchema>
): Promise<{
  error?: string;
  success?: string;
  twoFactor?: boolean;
}> => {
  console.log("logging in...");
  console.log("values", values);
  const validatedFields = LoginFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (
    !existingUser ||
    !existingUser.email ||
    !existingUser.password
  ) {
    return {
      error: "Invalid credentials",
    };
  }

  if (!existingUser.emailVerified) {
    const newVerificationToken =
      await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(
      newVerificationToken.email,
      newVerificationToken.token
    );

    return {
      error:
        "Please check your email to verify your account in order to log in",
    };
  }

  if (
    existingUser.isTwoFactorEnabled &&
    existingUser.email
  ) {
    if (code) {
      // confirm code
      const existingToken = await getTwoFactorTokenByEmail(
        existingUser.email
      );
      if (!existingToken)
        return { error: "No token exists" };
      const isMatchingTokens = code === existingToken.token;
      if (!isMatchingTokens)
        return { error: "Invalid code" };

      const hasExpired =
        new Date(existingToken.expires) < new Date();

      if (hasExpired) return { error: "Token has expired" };

      await db.twoFactorToken.delete({
        where: { id: existingToken.id },
      });

      const existingConfirmation =
        await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twofactorToken = await generateTwoFactorToken(
        existingUser.email
      );
      if (!twofactorToken)
        return {
          error: "Could not establish two factor token",
        };
      await sendTwoFactorTokenConfirmationEmail(
        twofactorToken.email,
        twofactorToken.token
      );

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "signed in" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials",
          };

        case "AccessDenied":
          return {
            error:
              "Access Denied. Please confirm your account email",
          };

        default:
          return {
            error: `Something went wrong: ${error.type}`,
          };
      }
    }

    throw error;
  }
};
