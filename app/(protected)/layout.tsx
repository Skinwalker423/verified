import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { NavBar } from "./_components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Settings",
  description: "user dashboard for all available settings",
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <main className=' w-full h-full flex flex-col items-center justify-center blue-gradient gap-5'>
        <NavBar />

        {children}
      </main>
    </SessionProvider>
  );
}
