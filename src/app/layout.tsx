import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { LoaderProvider } from "./providers/LoaderProvider";
import { ApiDataProvider } from "./providers/apiDataProvider/ApiDataProvider";
import { ViewportProvider } from "./providers/ViewportProvider";

const siteUrl = "https://conspira.fi";
const title = "Conspira.fi - Conspiracy Prediction Markets";
const description =
  "Every week, a new conspiracy becomes a market. Prediction markets cut through the noise. Every signal strengthens the symbol: $MOCK.";
const ogImage = `${siteUrl}/conspirafi-og.png`;

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(siteUrl),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description:
      "From comets to psyops, every conspiracy becomes a signal. Trade the probabilities, track the truth, strengthen the symbol: $MOCK.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Conspira.fi - Conspiracy Prediction Markets",
      },
    ],
    siteName: "Conspira.fi",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "Conspiracies collapse into probabilities. Prediction markets are capitalism applied to truth. Every signal strengthens the symbol: $MOCK.",
    images: [ogImage],
    creator: "@agent_mock",
  },
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
            <ViewportProvider>
              <LoaderProvider>{children}</LoaderProvider>
            </ViewportProvider>
          </ApiDataProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
