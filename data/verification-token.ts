import db from "@/lib/db";

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const token = await db.verificationToken.findFirst({
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

export const getVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken =
      await db.verificationToken.findUnique({
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
