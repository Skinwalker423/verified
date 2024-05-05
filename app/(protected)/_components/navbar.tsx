"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const NavBar = () => {
  const pathname = usePathname();
  return (
    <nav className='bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm'>
      <div className='flex gap-x-2'>
        <Button
          variant={
            pathname === "/server" ? "warning" : "outline"
          }
          asChild
        >
          <Link href={"/server"}>Server</Link>
        </Button>
        <Button
          variant={
            pathname === "/client" ? "warning" : "outline"
          }
          asChild
        >
          <Link href={"/client"}>Client</Link>
        </Button>
        <Button
          variant={
            pathname === "/admin" ? "warning" : "outline"
          }
          asChild
        >
          <Link href={"/admin"}>Admin</Link>
        </Button>
        <Button
          variant={
            pathname === "/settings" ? "warning" : "outline"
          }
          asChild
        >
          <Link href={"/settings"}>Settings</Link>
        </Button>
      </div>
      <p>User Button</p>
    </nav>
  );
};
