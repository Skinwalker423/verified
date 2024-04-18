"use client";

import { PropsWithChildren } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../card";
import Link from "next/link";
import { Header } from "./header";
import { Social } from "./social";

interface CardWrapperProps extends PropsWithChildren {
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  backButtonLabel,
  backButtonHref,
  headerLabel,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className='w-[400px]'>
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
          <Link href={backButtonHref}>
            {backButtonLabel}
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};
