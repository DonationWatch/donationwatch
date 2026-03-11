import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { BASE_URL } from "@/utils/config";
import { baseOpenGraph, baseTwitter } from "@/utils/meta";

export const metadata: Metadata = {
  title: "DonationWatch",
  metadataBase: new URL(BASE_URL),
  openGraph: baseOpenGraph(),
  twitter: baseTwitter(),
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/x-icon",
        url: "/favicon.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        url: "/favicon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
