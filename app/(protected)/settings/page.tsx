"use client";

import { logout } from "@/actions/logout";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { useTransition } from "react";

const SettingsPage = () => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      settings({ name: "new name" }).then((data) => {
        if (data?.error) {
          console.error(data.error);
        }
      });
    });
  };

  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>
          ⚙️ Settings
        </p>
      </CardHeader>
      <CardContent>
        <Button disabled={isPending} onClick={onClick}>
          Update Name
        </Button>
        <Button>Update Email</Button>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
