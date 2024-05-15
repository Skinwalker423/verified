"use server";

import * as z from "zod";

import db from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { getCurrentUser } from "@/lib/auth";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const validatedFields = SettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const user = await getCurrentUser();

  if (!user?.id) return { error: "Unauthorized" };

  const dbUser = await getUserById(user.id);

  if (!dbUser) return { error: "Unauthorized" };

  await db.user.updateMany({
    where: { id: dbUser.id },
    data: {
      name: validatedFields.data.name,
    },
  });

  return { success: "Successfully updated profile" };
};
