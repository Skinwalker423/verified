"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

const SettingsPage = () => {
  // const session = await auth();
  const { data } = useSession();

  console.log({ data });

  if (!data) return null;

  return (
    <div>
      SettingsPage
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
    </div>
  );
};

export default SettingsPage;
