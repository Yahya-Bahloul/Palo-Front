// src/components/game/CategorySection.tsx
"use client";

import { theme } from "@/styles/theme";
import { useTranslation } from "react-i18next";

type Props = {
  isMyTurn: boolean;
  categories: string[];
  handleChooseCategory: (category: string) => void;
  currentPlayerName: string;
};

export function CategorySection({
  isMyTurn,
  categories,
  handleChooseCategory,
  currentPlayerName,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-4 items-center">
      <h2 className={theme.text.subheading}>
        {isMyTurn ? t("choose") : t("waiting", { player: currentPlayerName })}
      </h2>

      <div className="grid gap-4 w-full max-w-md">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleChooseCategory(cat)}
            className={`${theme.button.base} ${theme.button.category} ${
              !isMyTurn ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isMyTurn}
          >
            {t(`category.${cat.toLowerCase()}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
