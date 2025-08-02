"use client"; // Ensure this component runs client-side

import { ReactNode } from "react";
import "../app/globals.css"; // Global styles
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import { theme } from "@/styles/theme";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Tnjya</title>
      </head>
      <body className={`${theme.background} text-white pb-[80px]`}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </body>
    </html>
  );
}
