// src/app/providers.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import { useHtmlLangDir } from "@/hooks/useHtmlLangDir";
import { I18nInitializerWrapper } from "@/utils/I18nInitializer";
import { PurchasesInitializer } from "@/utils/PurchasesInitializer";

export function Providers({ children }: { children: ReactNode }) {
  const { lang, dir } = useHtmlLangDir();

  // <html> lives in the server layout (needed for `metadata`), so keep lang/dir in sync here
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return (
    <I18nextProvider i18n={i18n}>
      <I18nInitializerWrapper>
        <PurchasesInitializer>{children}</PurchasesInitializer>
      </I18nInitializerWrapper>
    </I18nextProvider>
  );
}
