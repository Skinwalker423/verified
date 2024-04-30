import db from "@/lib/db";

export const getPasswordResetTokenByEmail = async (
  email: string
) => {
  try {
    const token = await db.passwordResetToken.findFirst({
      where: { email },
    });

    return token;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    return null;
  }
};

export const getPasswordResetTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken =
      await db.passwordResetToken.findUnique({
        where: { token },
      });

    return verificationToken;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    return null;
  }
};
