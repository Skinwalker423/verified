"use client";

import { logout } from "@/actions/logout";
import { PropsWithChildren } from "react";

interface LogoutButtonProps extends PropsWithChildren {}

export const LogoutButton = ({
  children,
}: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };
  return <span onClick={onClick}>{children}</span>;
};
