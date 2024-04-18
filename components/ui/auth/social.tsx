"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../button";

export const Social = () => {
  return (
    <div className='flex items-center w-full gap-x-2'>
      <Button
        size={"lg"}
        variant={"outline"}
        className='w-full'
        onClick={() => {
          console.log("signing in with google");
        }}
      >
        <FcGoogle />
      </Button>
      <Button
        size={"lg"}
        variant={"outline"}
        className='w-full'
        onClick={() => {
          console.log("signing in with github");
        }}
      >
        <FaGithub />
      </Button>
    </div>
  );
};
