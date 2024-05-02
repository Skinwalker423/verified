import db from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (
  userId: string
) => {
  try {
    const confirmation =
      await db.twoFactorConfirmation.findUnique({
        where: {
          userId,
        },
        include: {
          user: true,
        },
      });

    return confirmation;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    return null;
  }
};
