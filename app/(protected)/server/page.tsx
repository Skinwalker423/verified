import { UserInfo } from "@/components/user-info";
import { getCurrentUser } from "@/lib/auth";

const ServerPage = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div>
      <h1>ServerPage</h1>
      <UserInfo label='Server Component' user={user} />
    </div>
  );
};

export default ServerPage;
