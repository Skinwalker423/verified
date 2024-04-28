"use server";

import { RegisterFormSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (
  values: z.infer<typeof RegisterFormSchema>
): Promise<{ error?: string; success?: string }> => {
  const validatedFields =
    RegisterFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { password, email, name } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: "Email already exists",
    };
  }

  const newUser = await db.user.create({
    data: { email, name, password: hashedPassword },
  });

  console.log("new user", newUser);

  // create a verification token

  if (!newUser) {
    return { error: "Problem registering new account" };
  }

  const verificationToken = await generateVerificationToken(
    newUser.email
  );

  console.log("new token created", verificationToken);

  // send verification token to email

  const verificationEmail = await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token
  );

  if (!verificationEmail)
    return {
      error:
        "Problem creating account and sending verification email. Try again",
    };
  console.log({ verificationEmail });

  return { success: "Confirmation email sent!" };
};
