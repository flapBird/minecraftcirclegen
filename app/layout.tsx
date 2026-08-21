import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const siteUrl = "https://minecraftcirclegen.com/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Minecraft Circle Gen",
  description:
    "Free Minecraft building generators for block shapes, gradients, blueprints, material counts, and PNG export.",
  applicationName: "Minecraft Circle Gen",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/favicon-32x32.png",
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f1e8",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4183802444188513"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
