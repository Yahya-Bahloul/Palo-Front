// src/components/LanguageSelect.tsx
"use client";

import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { theme } from "@/styles/theme";

const LanguageSelect = () => {
  const { i18n, t } = useTranslation();

  const handleChange = (lang: string) => {
    localStorage.setItem("app_language", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div
      key={i18n.language}
      className="absolute right-4 z-50"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className={theme.languageSelect.trigger}>
          <Globe className="h-4 w-4" />
          <span className="flex-1 text-center">{t("language")}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          className={theme.languageSelect.content}
        >
          <DropdownMenuItem
            onClick={() => handleChange("fr")}
            className="justify-center"
          >
            Français
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleChange("en")}
            className="justify-center"
          >
            English
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleChange("ar")}
            className="justify-center"
          >
            العربية
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelect;
