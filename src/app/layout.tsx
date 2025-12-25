import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ProgressBar } from "@/components/loading/progress-bar";
import { PageLoader } from "@/components/loading/page-loader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AdminSuite - DepEd School Management System",
  description: "Comprehensive school management system for DepEd Administrative Officers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PageLoader />
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
