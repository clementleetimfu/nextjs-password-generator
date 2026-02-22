import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: "Password Generator",
  description: "Secure password, PIN, and passphrase generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceMono.className}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
