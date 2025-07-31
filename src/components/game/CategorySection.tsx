// src/components/game/CategorySection.tsx
"use client";

import { theme } from "@/styles/theme";

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
  return (
    <div className="flex flex-col space-y-4 items-center">
      <h2 className={theme.text.subheading}>
        {isMyTurn
          ? "Choisis une catégorie :"
          : `${currentPlayerName} est en train de choisir une catégorie...`}
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
            {cat.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
