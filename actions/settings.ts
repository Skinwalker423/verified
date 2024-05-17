"use server";

import * as z from "zod";

import db from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { getCurrentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await getCurrentUser();

  if (!user?.id) return { error: "Unauthorized" };

  const dbUser = await getUserById(user.id);

  if (!dbUser) return { error: "Unauthorized" };

  if (user.isOAuth) {
    values.email = undefined;
    values.isTwoFactorEnabled = undefined;
    values.password = undefined;
    values.newPassword = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use" };
    }

    const verificationToken =
      await generateVerificationToken(values.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: "Email verification sent! Check your email.",
    };
  }

  if (
    values.password &&
    values.newPassword &&
    dbUser.password
  ) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordMatch)
      return { error: "Invalid password" };

    const newHashedPassword = await bcrypt.hash(
      values.newPassword,
      12
    );

    values.password = newHashedPassword;
    values.newPassword = undefined;
  }

  await db.user.updateMany({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Successfully updated profile" };
};
