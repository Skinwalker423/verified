"use server";

import { v4 as uuidv4 } from "uuid";
import db from "./db";
import {
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
} from "@/data/verification-token";
import { getUserByEmail } from "@/data/user";

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
      return { error: "Token does not exist" };

    const expiration = verificationToken?.expires;
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
