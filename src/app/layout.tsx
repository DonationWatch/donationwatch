import "./globals.css";
import { BASE_URL } from "../utils/config";
import { baseOpenGraph, baseTwitter } from "../utils/meta";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "DonationWatch",
  metadataBase: new URL(BASE_URL),
  openGraph: baseOpenGraph(),
  twitter: baseTwitter(),
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
