import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Inter,
  Noto_Sans_KR,
  Noto_Serif_KR,
} from "next/font/google";

import "./globals.css";

const bodyFont = Noto_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const displayFont = Noto_Serif_KR({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const latinDisplayFont = Inter({
  variable: "--font-latin",
  subsets: ["latin"],
  weight: ["900"],
});

export const metadata: Metadata = {
  title: {
    default: "Inkyu Pak | Backend Portfolio",
    template: "%s | Inkyu Pak",
  },
  description:
    "Premium editorial portfolio and CMS client for a Korean backend engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} ${latinDisplayFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
