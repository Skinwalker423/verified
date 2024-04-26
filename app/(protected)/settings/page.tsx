import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import Image from "next/image";

const SettingsPage = async () => {
  const session = await auth();

  console.log({ session });

  if (!session) return null;

  return (
    <div>
      SettingsPage
      <h1>Hello, {session?.user?.name || "Stranger"}</h1>
      <p>{session?.user?.email}</p>
      <SignOutButton />
      {session.user?.image && (
        <Image
          src={session.user?.image}
          alt='avatar'
          width={24}
          height={24}
        />
      )}
    </div>
  );
};

export default SettingsPage;
