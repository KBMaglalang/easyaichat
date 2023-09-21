import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

// components
import Login from "@/components/Login";

import { SessionProvider } from "@/components/SessionProvider";
import { StateProvider } from "@/lib/context/stateContext";
import ClientProvider from "@/components/ClientProvider";

export const metadata = {
  title: "YAChatGPT",
  description:
    "Enhance your experience with our ChatGPT frontend. Store messages, create prompt templates, switch models, and modify responses easily",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {!session ? (
            <Login />
          ) : (
            <StateProvider>
              <div className="flex justify-center w-screen h-full md:h-screen">
                {/* client provider - notification  */}
                <ClientProvider />
                {children}
              </div>
            </StateProvider>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}

/*
  ! note: getServerSession is still experimental
*/
