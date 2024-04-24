import { auth } from "@/auth";
import { SignOutButton } from "@/components/ui/auth/sign-out-button";

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
    </div>
  );
};

export default SettingsPage;
