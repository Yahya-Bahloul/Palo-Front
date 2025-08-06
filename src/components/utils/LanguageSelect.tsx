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

const LanguageSelect = () => {
  const { i18n, t } = useTranslation();

  const handleChange = (lang: string) => {
    localStorage.setItem("app_language", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div key={i18n.language} className="absolute top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center gap-2 bg-yellow-300 text-black border-4 border-black px-3 py-1 rounded shadow-[4px_4px_0_0_black] font-mono hover:bg-yellow-400 transition w-40 text-center">
          <Globe className="h-4 w-4" />
          <span className="flex-1 text-center">{t("language")}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          className="bg-yellow-100 border-2 border-black rounded-md text-black shadow-lg w-40 font-mono text-center"
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
