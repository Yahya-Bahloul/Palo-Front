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
    <div className={theme.phase.bare}>
      <div className="space-y-1.5">
        <p className={theme.phase.eyebrow}>{t("category.title", "Catégorie")}</p>
        <h2 className={theme.phase.title}>
          {isMyTurn ? t("choose") : t("waiting", { player: currentPlayerName })}
        </h2>
      </div>

      <div className="grid gap-4 w-full">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleChooseCategory(cat)}
            className={isMyTurn ? theme.phase.option : theme.phase.optionIdle}
            disabled={!isMyTurn}
          >
            {t(`category.${cat.toLowerCase()}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
