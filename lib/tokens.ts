"use server";

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import db from "./db";
import {
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
} from "@/data/verification-token";
import { getUserByEmail } from "@/data/user";
import {
  getPasswordResetTokenByEmail,
  getPasswordResetTokenByToken,
} from "@/data/password-reset-token";

export const generateVerificationToken = async (
  email: string
) => {
  const newToken = uuidv4();
  const expires = new Date(
    new Date().getTime() + 3600 * 1000
  );

  const existingToken = await getVerificationTokenByEmail(
    email
  );

  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const newVerificationToken =
    await db.verificationToken.create({
      data: { email, token: newToken, expires },
    });
  return newVerificationToken;
};

export const updateVerificatonToken = async (
  token: string
) => {
  if (!token) return;
  try {
    const verificationToken =
      await getVerificationTokenByToken(token);

    if (!verificationToken || !verificationToken.email)
      return {
        error:
          "Token does not exist or has been already verified. Try logging in",
      };

    const expiration = verificationToken.expires;
    const now = new Date();

    if (!expiration || expiration < now) {
      return { error: "Token has expired" };
    }

    const user = await getUserByEmail(
      verificationToken.email
    );

    if (!user) return { error: "Email does not exist" };

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        email: verificationToken.email,
      },
    });

    if (!updatedUser)
      return { error: "could not find or update user" };

    await db.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { success: "email verified" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    console.error("problem verifying token");
  }
};

export const generatePasswordResetToken = async (
  email: string
) => {
  const newToken = uuidv4();
  const expires = new Date(
    new Date().getTime() + 3600 * 1000
  );

  const existingToken = await getPasswordResetTokenByEmail(
    email
  );

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const newVerificationToken =
    await db.passwordResetToken.create({
      data: { email, token: newToken, expires },
    });
  return newVerificationToken;
};

interface PasswordResetProps {
  token: string;
  password: string;
}

export const updatePasswordResetToken = async ({
  token,
  password,
}: PasswordResetProps) => {
  if (!token || !password) return;
  try {
    const verificationToken =
      await getPasswordResetTokenByToken(token);

    if (!verificationToken || !verificationToken.email)
      return {
        error:
          "Token does not exist or has been already verified. Try logging in",
      };

    const expiration = verificationToken.expires;
    const now = new Date();

    if (!expiration || expiration < now) {
      return { error: "Token has expired" };
    }

    const user = await getUserByEmail(
      verificationToken.email
    );

    if (!user) return { error: "Email does not exist" };

    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        email: verificationToken.email,
        password: hashedPassword,
      },
    });

    if (!updatedUser)
      return { error: "could not find or update user" };

    await db.passwordResetToken.delete({
      where: { id: verificationToken.id },
    });

    return { success: "email verified" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    console.error("problem verifying token");
  }
};
