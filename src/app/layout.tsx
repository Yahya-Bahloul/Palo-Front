// src/app/layout.tsx
"use client";

import { ReactNode } from "react";
import "../app/globals.css";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import { theme } from "@/styles/theme";
import { useHtmlLangDir } from "@/hooks/useHtmlLangDir";
import { I18nInitializerWrapper } from "@/utils/I18nInitializer";

export default function RootLayout({ children }: { children: ReactNode }) {
  const { lang, dir } = useHtmlLangDir();

  return (
    <html lang={lang} dir={dir}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Tnjya</title>
      </head>
      <body className={`${theme.background} text-white pb-[80px]`}>
        <I18nextProvider i18n={i18n}>
          <I18nInitializerWrapper>{children}</I18nInitializerWrapper>
        </I18nextProvider>
      </body>
    </html>
  );
}
