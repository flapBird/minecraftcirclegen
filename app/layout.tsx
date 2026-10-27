import { DEFAULT_SOCIAL_IMAGES } from "@/lib/site/social-metadata";
import type { Metadata, Viewport } from "next";
import { ANALYTICS_LOCAL_HOSTNAME_GUARD } from "@/lib/site/analytics-guard";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

// Plain inline loaders with a runtime hostname guard: vinext's Cloudflare
// runtime drops next/script tags from SSR, and analytics/ads must not depend
// on framework script quirks (or fire on local development hosts).
const ADSENSE_LOADER = `(function(){
  if (${ANALYTICS_LOCAL_HOSTNAME_GUARD}) return;
  var s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4183802444188513';
  document.head.appendChild(s);
})();`;

const CLARITY_LOADER = `(function(c,l,a,r,i,t,y){
  if (${ANALYTICS_LOCAL_HOSTNAME_GUARD}) return;
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "yoqcv66g25");`;

const siteUrl = "https://minecraftcirclegen.com/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Minecraft Circle Gen",
  description:
    "Free Minecraft building generators for block shapes, gradients, blueprints, material counts, and PNG export.",
  openGraph: { images: DEFAULT_SOCIAL_IMAGES },
  twitter: { card: "summary_large_image", images: DEFAULT_SOCIAL_IMAGES },
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
        <script
          dangerouslySetInnerHTML={{ __html: ADSENSE_LOADER }}
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
        <script dangerouslySetInnerHTML={{ __html: CLARITY_LOADER }} />
      </body>
    </html>
  );
}
