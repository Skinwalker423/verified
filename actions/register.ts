"use server";

import { RegisterFormSchema } from "@/schemas";
import { z } from "zod";

export const register = async (
  values: z.infer<typeof RegisterFormSchema>
): Promise<{ error?: string; success?: string }> => {
  console.log("Registering...");
  console.log("values", values);
  const validatedFields =
    RegisterFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  return { success: "Email sent" };
};
