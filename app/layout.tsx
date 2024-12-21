import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ClientRootLayout from "./components/ClientRootLayout";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Sofa AI - Your Event Platform",
  description: "Discover and join amazing events near you",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col bg-mainWhite`}>
        <SessionProvider>
          {/* Add Suspense here with a fallback UI */}
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ClientRootLayout>{children}</ClientRootLayout>
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  );
}
