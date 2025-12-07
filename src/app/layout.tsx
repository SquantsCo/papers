import type { Metadata } from "next";
import "./globals.css";
import { SiteLayout } from "@/components/Layout";

export const metadata: Metadata = {
  title: "Squants.com – Quantum, Papers & Learning Paths",
  description:
    "Squants.com is a hub for quantum physics learners, with paper explanations, beginner pathways, and a growing community.",
  metadataBase: new URL("https://squants.com"),
  openGraph: {
    title: "Squants.com – Quantum, Papers & Learning Paths",
    description:
      "Paper explainers, quantum learning paths, and a focused community space.",
    url: "https://squants.com",
    siteName: "Squants.com",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
