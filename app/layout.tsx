import type { Metadata } from "next";
import { Toaster } from "sonner";
import RightSideBar from "./components/RightSideBar";
import SideNav from "./components/SideNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlueBird",
  description: "Tweets built with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-black dark:text-white flex justify-center overscroll-none">
        <SideNav />
        <main className="w-full max-w-[600px] h-full min-h-screen border-x border-neutral-200 dark:border-white/20">
          {children}
          <Toaster position="top-right" />
        </main>
        <RightSideBar />
      </body>
    </html>
  );
}
