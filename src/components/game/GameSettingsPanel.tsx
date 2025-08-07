// src/components/game/GameSettingsPanel.tsx
"use client";

import { GameConfig } from "@/model/gameConfig";
import { Settings, ChevronUp, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";

type Props = {
  gameConfig: GameConfig;
  setGameConfig: (config: GameConfig) => void;
  isAdmin: boolean;
};

export function GameSettingsPanel({
  gameConfig,
  setGameConfig,
  isAdmin,
}: Props) {
  const { t } = useTranslation();
  const MIN_ROUNDS = 5;
  const MAX_ROUNDS = 30;

  const LANG_OPTIONS = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
  ];

  const incrementRounds = () => {
    if (gameConfig.maxRound < MAX_ROUNDS) {
      setGameConfig({ ...gameConfig, maxRound: gameConfig.maxRound + 1 });
    }
  };

  const decrementRounds = () => {
    if (gameConfig.maxRound > MIN_ROUNDS) {
      setGameConfig({ ...gameConfig, maxRound: gameConfig.maxRound - 1 });
    }
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGameConfig({ ...gameConfig, lang: e.target.value });
  };

  if (!isAdmin) return null;

  return (
    <div
      className={`bg-black/10 border-2 border-yellow-500/80 rounded-2xl p-5 space-y-4 shadow-xl`}
    >
      <div className="flex items-center gap-2 text-yellow-400">
        <Settings className="h-5 w-5" />
        <h2 className="text-md font-extrabold uppercase tracking-widest">
          {t("settingsTitle")}
        </h2>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">
          {t("numberOfRounds")}
        </label>

        <div className="flex items-center gap-2">
          <div className="px-4 py-1 text-sm font-mono text-yellow-300 border-2 border-yellow-400 rounded-lg bg-black/20">
            {gameConfig.maxRound}
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={incrementRounds}
              disabled={gameConfig.maxRound >= MAX_ROUNDS}
              className={`rounded-full p-1 border-2 border-yellow-400 hover:bg-yellow-500/20 active:scale-90 ${
                theme.effects.transition
              } ${
                gameConfig.maxRound >= MAX_ROUNDS
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronUp className="h-4 w-4 text-yellow-300" />
            </button>
            <button
              onClick={decrementRounds}
              disabled={gameConfig.maxRound <= MIN_ROUNDS}
              className={`rounded-full p-1 border-2 border-yellow-400 hover:bg-yellow-500/20 active:scale-90 ${
                theme.effects.transition
              } ${
                gameConfig.maxRound <= MIN_ROUNDS
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronDown className="h-4 w-4 text-yellow-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">
          {t("language")}
        </label>
        <select
          value={gameConfig.lang || "en"}
          onChange={handleLangChange}
          className="px-4 py-1 text-sm font-mono text-yellow-300 border-2 border-yellow-400 rounded-lg bg-black/20 focus:outline-none"
        >
          {LANG_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
