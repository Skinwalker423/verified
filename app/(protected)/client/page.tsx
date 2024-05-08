"use client";

import { UserInfo } from "@/components/user-info";
import useCurrentUser from "@/hooks/use-current-user";
import React from "react";

const ClientPage = () => {
  const { user } = useCurrentUser();
  if (!user) return null;
  return (
    <div>
      <h1>Client Page</h1>
      <UserInfo label='Client Component' user={user} />
    </div>
  );
};

export default ClientPage;
