"use server";

import { loginFormSchema } from "@/schemas";
import { z } from "zod";

export const login = async (
  values: z.infer<typeof loginFormSchema>
): Promise<{ error?: string; success?: string }> => {
  console.log("logging in...");
  console.log("values", values);
  const validatedFields = loginFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  return { success: "Email sent" };
};
