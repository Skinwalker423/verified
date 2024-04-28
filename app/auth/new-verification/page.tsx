import { getVerificationTokenByToken } from "@/data/verification-token";
import db from "@/lib/db";
import { updateVerificatonToken } from "@/lib/tokens";
import { notFound } from "next/navigation";

const NewVerificationPage = async ({
  searchParams,
}: {
  searchParams: { token: string };
}) => {
  console.log("search params", searchParams);

  if (!searchParams || !searchParams.token) {
    return notFound();
  }

  const token = searchParams.token;

  const verificationToken =
    await getVerificationTokenByToken(token);

  if (!verificationToken) {
    return (
      <div>
        Invalid token or already verified. Try logging in
      </div>
    );
  }

  const user = await db.user.findFirst({
    where: { email: verificationToken?.email },
  });

  if (!user || user.emailVerified) {
    return (
      <div>Email already verified. Please log in.</div>
    );
  }

  const expiration = verificationToken?.expires;
  const now = new Date();

  if (!expiration || expiration < now) {
    return (
      <div>
        Token expired. Send another request to verify
        account.
        <button>Request</button>
      </div>
    );
  }

  console.log("expires", expiration < now);
  await updateVerificatonToken(verificationToken.token);

  return (
    <div>
      Email Verified <a href='/auth/login'>Go to login</a>
    </div>
  );
};

export default NewVerificationPage;
