import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import StoreInitializer from "@/app/expenses/store-initializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grapicar Expenses",
  description: "Grapicar Expenses",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "경비" },
};

export const viewport = {
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreInitializer />
        <Toaster />
        <div className="flex min-h-screen items-center justify-center font-sans">
          {children}
        </div>
      </body>
    </html>
  );
}
