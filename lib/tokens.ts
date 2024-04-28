import { v4 as uuidv4 } from "uuid";
import db from "./db";
import {
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
} from "@/data/verification-token";

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

  const verificationToken =
    await getVerificationTokenByToken(token);

  if (!verificationToken || !verificationToken.email)
    return;

  const updatedUser = await db.user.update({
    where: { email: verificationToken.email },
    data: { emailVerified: new Date() },
  });

  if (!updatedUser) return;

  await db.verificationToken.delete({
    where: { id: verificationToken.id },
  });

  console.log({ updatedUser });
};
