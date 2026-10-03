// src/app/layout.tsx
import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "../app/globals.css";
import { theme } from "@/styles/theme";
import { Providers } from "./providers";

const SITE_URL = "https://blaafy.com";
const TITLE = "Blaafy – Jeu de bluff et de quiz entre amis";
const DESCRIPTION =
  "Blaafy, le jeu de bluff multijoueur en temps réel : invente de fausses réponses, devine la vraie et piège tes amis. Gratuit, sans inscription, jouable sur mobile et navigateur.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Blaafy" },
  description: DESCRIPTION,
  applicationName: "Blaafy",
  keywords: [
    "Blaafy",
    "jeu de bluff",
    "quiz entre amis",
    "jeu multijoueur en ligne",
    "party game",
    "trivia",
    "bluffing game",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Blaafy",
    title: TITLE,
    description: DESCRIPTION,
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar"],
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Blaafy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
  themeColor: "#0f0f23",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Blaafy",
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: "GameApplication",
  operatingSystem: "Web, Android, iOS",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  inLanguage: ["fr", "en", "ar"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-skin="retro">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={theme.background}
        style={{ color: "var(--skin-text)" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
