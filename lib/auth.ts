"use server";

import { auth } from "@/auth";

export const getCurrentUser = async () => {
  const session = await auth();

  if (!session) return null;

  return session.user;
};
