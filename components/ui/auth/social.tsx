"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const onClick = async (provider: "google" | "github") => {
    await signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className='flex items-center w-full gap-x-2'>
      <Button
        size={"lg"}
        variant={"outline"}
        className='w-full'
        onClick={() => onClick("google")}
      >
        <FcGoogle />
      </Button>

      <Button
        size={"lg"}
        variant={"outline"}
        className='w-full'
        type='submit'
        onClick={() => onClick("github")}
      >
        <FaGithub />
      </Button>
    </div>
  );
};
