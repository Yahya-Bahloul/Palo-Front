// src/components/I18nInitializerWrapper.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";

function StaticIntro() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold">Blaafy</h1>
      <p className="text-lg">
        The real-time bluffing party game. Invent fake answers, guess the real one and fool
        your friends.
      </p>
      <p className="text-sm opacity-80">
        Free to play, no sign-up required. Play with friends on mobile or in your browser, in
        English, French or Arabic.
      </p>
    </main>
  );
}

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

  // Static English fallback: it is what crawlers get in the prerendered HTML and what
  // users see for a split second before the saved language is applied.
  if (!ready) return <StaticIntro />;

  return <>{children}</>;
}
