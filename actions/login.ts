"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginFormSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (
  values: z.infer<typeof LoginFormSchema>
): Promise<{ error?: string; success?: string }> => {
  console.log("logging in...");
  console.log("values", values);
  const validatedFields = LoginFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

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
