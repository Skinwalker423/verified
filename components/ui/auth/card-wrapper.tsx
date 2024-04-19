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
import { BackButton } from "./back-button";

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
    <Card className='w-[400px] py-5 sm:py-2'>
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton
          href={backButtonHref}
          label={backButtonLabel}
        />
      </CardFooter>
    </Card>
  );
};
