"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Suspense } from "react";

const SettingsPage = () => {
  const { data, status } = useSession();
  if (status === "loading") return null;

  return (
    <div className='bg-white'>
      SettingsPage
      <Suspense fallback={"Loading..."}>
        <h1>Hello, {data?.user?.name || "Stranger"}</h1>
        <p>{data?.user?.email}</p>
        {data?.user?.image && (
          <Image
            src={data?.user?.image}
            alt='avatar'
            width={24}
            height={24}
          />
        )}
        <Button onClick={() => logout()}>Sign Out</Button>
      </Suspense>
    </div>
  );
};

export default SettingsPage;
