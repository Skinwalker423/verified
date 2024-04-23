import { auth } from "@/auth";

const SettingsPage = async () => {
  const session = await auth();

  console.log({ session });

  return <div>SettingsPage</div>;
};

export default SettingsPage;
