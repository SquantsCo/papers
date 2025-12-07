import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteLayout } from "@/components/Layout";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export const metadata: Metadata = {
  title: "Squants.com – Quantum, Papers & Learning Paths",
  description:
    "Squants.com is a hub for quantum physics learners, with paper explanations, beginner pathways, and a growing community.",
  metadataBase: new URL("https://squants.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Squants",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-180x180.png",
    other: [
      {
        rel: "icon",
        url: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Squants.com – Quantum, Papers & Learning Paths",
    description:
      "Paper explainers, quantum learning paths, and a focused community space.",
    url: "https://squants.com",
    siteName: "Squants.com",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Squants - Quantum Papers & Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Squants.com – Quantum, Papers & Learning Paths",
    description: "Paper explainers, quantum learning paths, and community.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Squants" />
        <meta name="msapplication-navbutton-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-startup-image" href="/icons/icon-192x192.png" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {
                  // Service worker registration failed, app still works
                });
              });
            }
          `
        }} />
      </head>
      <body>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
