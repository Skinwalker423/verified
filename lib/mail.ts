import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${
    process.env.NODE_ENV === "production"
      ? `${process.env.BASE_URL}/auth/new-verification?token=${token}`
      : "http://localhost:3000"
  }/auth/new-verification?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm your email",
      html: `<p><a href="${confirmLink}">Click to confirm account</a></p>`,
    });

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return;
    }
  }
};
export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${
    process.env.NODE_ENV === "production"
      ? `${process.env.BASE_URL}/auth/new-password?token=${token}`
      : "http://localhost:3000"
  }/auth/new-password?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm your email",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
    });

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return;
    }
  }
};

export const sendTwoFactorTokenConfirmationEmail = async (
  email: string,
  token: string
) => {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "2FA Confirmation Code",
      html: `<p>Here is your 6 digit code: ${token}</p>`,
    });

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return;
    }
  }
};
