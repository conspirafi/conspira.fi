import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { LoaderProvider } from "./providers/LoaderProvider";
import { ApiDataProvider } from "./providers/apiDataProvider/ApiDataProvider";

export const metadata: Metadata = {
  title: "Conspira.Fi",
  description: "Will comet 3I/ATLAS show evidence of alien technology?",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <ApiDataProvider>
            <LoaderProvider>{children}</LoaderProvider>
          </ApiDataProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
