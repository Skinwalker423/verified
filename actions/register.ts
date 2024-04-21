"use server";

import { RegisterFormSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { getUserByEmail } from "@/data/user";

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

  // send verification token to email

  return { success: "User created" };
};
