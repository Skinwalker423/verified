import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface BackButtonProps {
  label: string;
  href: string;
}

export const BackButton = ({
  href,
  label,
}: BackButtonProps) => {
  return (
    <Button
      className='font-normal w-full'
      variant={"link"}
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
