// src/components/I18nInitializerWrapper.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  children: ReactNode;
};

export function I18nInitializerWrapper({ children }: Props) {
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("app_language");

    const applyLanguage = async () => {
      if (savedLang && savedLang !== i18n.language) {
        await i18n.changeLanguage(savedLang);
      }
      setReady(true);
    };

    applyLanguage();
  }, []);

  if (!ready) return null; // ou spinner

  return <>{children}</>;
}
