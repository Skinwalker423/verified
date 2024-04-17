"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

interface LoginButtonProps extends PropsWithChildren {
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild = false,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    console.log("login button clicked");
    router.push("/login");
  };

  if (mode === "modal") {
    console.log("modal open");
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you absolutely sure?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will
              permanently delete your account and remove
              your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span onClick={onClick} className='cursor-pointer'>
      {children}
    </span>
  );
};

export default LoginButton;
