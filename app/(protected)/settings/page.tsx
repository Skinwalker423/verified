import { auth } from "@/auth";

const SettingsPage = async () => {
  const session = await auth();

  console.log({ session });

  return (
    <div>
      SettingsPage
      <h1>Hello, {session?.user?.name || "Stranger"}</h1>
      <p>{session?.user?.email}</p>
    </div>
  );
};

export default SettingsPage;
