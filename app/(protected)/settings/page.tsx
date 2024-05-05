"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Suspense } from "react";

const SettingsPage = () => {
  // const { data, status } = useSession();
  // if (status === "loading") return null;

  return (
    <div className='bg-white'>
      SettingsPage
      <Button onClick={() => logout()}>Sign Out</Button>
    </div>
  );
};

export default SettingsPage;
