"use server";

import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  try {
    const user = await getCurrentUser();

    if (user?.role !== UserRole.ADMIN) {
      return { error: "Forbidden" };
    } else {
      return { success: "Allowed access" };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "problem getting user role info" };
  }
};
