import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${
    process.env.NODE_ENV === "production"
      ? process.env.BASE_URL
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
