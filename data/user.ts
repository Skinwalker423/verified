import db from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    if (!email) return null;
    const user = await db.user.findFirst({
      where: { email },
    });

    return user;
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
};
export const getUserById = async (id: string) => {
  try {
    if (!id) return null;
    const user = await db.user.findUnique({
      where: { id },
    });

    return user;
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
};
