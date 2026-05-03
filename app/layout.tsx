import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import React, { Suspense } from "react";
import { cn } from "@/app/lib/utils";
import { Toaster } from "./components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { AuthModalWrapper } from "./components/ui/layout/wrapper";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={cn("dark", "antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <SessionProvider>
          {children}
          <Suspense fallback={null}>
            <AuthModalWrapper />
          </Suspense>
        </SessionProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
