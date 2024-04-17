"use client";

import { PropsWithChildren } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../card";
import { Button } from "../button";
import Link from "next/link";

interface CardWrapperProps extends PropsWithChildren {
  header: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  backButtonLabel,
  backButtonHref,
  header,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className='w-[400px]'>
      <CardHeader>{header}</CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        {showSocial && <p>Socials</p>}
        <Link href={backButtonHref}>{backButtonLabel}</Link>
      </CardFooter>
    </Card>
  );
};
