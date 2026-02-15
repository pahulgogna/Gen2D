import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { verifyJWT } from "./actions/auth/auth";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  
  title: "Gen2D",
  description: "2D video generator",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  let user = await verifyJWT()

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-auto`}>
        <div className="p-4 py-5 flex justify-between border-b border-slate-800 text-xl font-bold fixed w-screen bg-black">
          <div className="flex flex-col justify-center h-full">
            <Link href={"/c"} className="">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-col justify-center h-fit">
            {
              user
              &&
              <Avatar user={user} />
            }
          </div>
        </div>
        <div className="pt-22">
          {children}
        </div>
      </body>
    </html>
  );
}
