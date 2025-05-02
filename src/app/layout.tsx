"use client"; // Ensure this component runs client-side

import { ReactNode } from "react";
import "../app/globals.css"; // Import global styles
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n"; // Import i18n instance

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My App</title>
      </head>
      <body className="bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-700 text-white">
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </body>
    </html>
  );
}
