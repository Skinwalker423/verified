"use client";

import { useSession } from "next-auth/react";

const useCurrentUser = () => {
  const { data } = useSession();

  return { user: data?.user };
};

export default useCurrentUser;
