"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetFormSchema } from "@/schemas";
import { z } from "zod";

export const reset = async (
  values: z.infer<typeof ResetFormSchema>
): Promise<{ error?: string; success?: string }> => {
  console.log("values", values);
  const validatedFields = ResetFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return {
      error: "Email not found",
    };
  }

  // check if user is oauth
  if (!existingUser.password) {
    return {
      error:
        "That email is associated with another provider. Try signing in using your original provider (Google, Github)",
    };
  }

  const newPasswordResetToken =
    await generatePasswordResetToken(existingUser.email);

  await sendPasswordResetEmail(
    newPasswordResetToken.email,
    newPasswordResetToken.token
  );

  return {
    success:
      "Email sent! Please check your email to verify your account",
  };
};
