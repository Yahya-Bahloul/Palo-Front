// src/components/game/GameSettingsPanel.tsx
"use client";

import { GameConfig } from "@/model/gameConfig";
import { Settings, Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";

type Props = {
  gameConfig: GameConfig;
  setGameConfig: (config: GameConfig) => void;
  isAdmin: boolean;
};

const MIN_ROUNDS = 5;
const MAX_ROUNDS = 30;

const LANG_OPTIONS = [
  { value: "fr", label: "FR", full: "Français" },
  { value: "en", label: "EN", full: "English" },
  { value: "ar", label: "ع", full: "العربية" },
];

export function GameSettingsPanel({ gameConfig, setGameConfig, isAdmin }: Props) {
  const { t } = useTranslation();

  const setRounds = (next: number) => {
    const clamped = Math.min(MAX_ROUNDS, Math.max(MIN_ROUNDS, next));
    setGameConfig({ ...gameConfig, maxRound: clamped });
  };

  if (!isAdmin) return null;

  return (
    <div className={theme.lobby.panel}>
      <div className={theme.lobby.sectionTitle}>
        <Settings className="h-4 w-4" />
        {t("settingsTitle")}
      </div>

      <div className={theme.lobby.settingRow}>
        <span className={theme.lobby.settingLabel}>{t("numberOfRounds")}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRounds(gameConfig.maxRound - 1)}
            disabled={gameConfig.maxRound <= MIN_ROUNDS}
            className="skin-stepper"
            aria-label={t("numberOfRounds") + " -"}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className={theme.lobby.readout}>{gameConfig.maxRound}</span>
          <button
            type="button"
            onClick={() => setRounds(gameConfig.maxRound + 1)}
            disabled={gameConfig.maxRound >= MAX_ROUNDS}
            className="skin-stepper"
            aria-label={t("numberOfRounds") + " +"}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={theme.lobby.settingRow}>
        <span className={theme.lobby.settingLabel}>
          {t("questionLanguage", "Langue des questions")}
        </span>
        <div className="skin-panel flex p-1 gap-1">
          {LANG_OPTIONS.map((opt) => {
            const active = (gameConfig.lang || "en") === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setGameConfig({ ...gameConfig, lang: opt.value })
                }
                title={opt.full}
                aria-pressed={active}
                className={`min-w-[40px] h-9 px-2 font-arcade text-sm font-bold rounded-lg transition ${
                  active
                    ? "bg-[color:var(--skin-primary)] text-[color:var(--skin-btn-color)]"
                    : "text-[color:var(--skin-muted)] hover:text-[color:var(--skin-text)]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
