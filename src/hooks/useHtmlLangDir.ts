// src/hooks/useHtmlLangDir.ts
import { useEffect, useState } from "react";
import i18n from "@/../i18n"; // chemin d’accès selon ton alias

export function useHtmlLangDir() {
  const [lang, setLang] = useState(i18n.language || "fr");
  const [dir, setDir] = useState<"ltr" | "rtl">(
    i18n.language === "ar" ? "rtl" : "ltr"
  );

  useEffect(() => {
    const update = (newLang: string) => {
      setLang(newLang);
      setDir(newLang === "ar" ? "rtl" : "ltr");
    };

    update(i18n.language); // initial

    i18n.on("languageChanged", update);

    return () => {
      i18n.off("languageChanged", update);
    };
  }, []);

  return { lang, dir };
}
