"use client";

import { GameConfig } from "@/model/gameConfig";
import { Settings, ChevronUp, ChevronDown } from "lucide-react";
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
  const MIN_ROUNDS = 5;
  const MAX_ROUNDS = 30;

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

  if (!isAdmin) return null;

  return (
    <div
      className={`${theme.effects.soft} rounded-xl p-5 ${theme.effects.shadow} space-y-4`}
    >
      <div className={`flex items-center mb-2 ${theme.colors.princaplLight}`}>
        <Settings className="h-4 w-4 mr-2" />
        <h2 className="text-sm font-bold uppercase tracking-wide">
          Paramètres
        </h2>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm text-white">Nombre de manches</label>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 text-sm text-white border border-[#e9c46a] rounded-lg">
            {gameConfig.maxRound}
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={incrementRounds}
              disabled={gameConfig.maxRound >= MAX_ROUNDS}
              className={`rounded-full p-1 border border-[#e9c46a] hover:bg-cyan-600/20 ${
                theme.effects.transition
              } ${
                gameConfig.maxRound >= MAX_ROUNDS
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronUp className="h-4 w-4 text-[#e9c46a]" />
            </button>
            <button
              onClick={decrementRounds}
              disabled={gameConfig.maxRound <= MIN_ROUNDS}
              className={`rounded-full p-1 border border-[#e9c46a] hover:bg-cyan-600/20 ${
                theme.effects.transition
              } ${
                gameConfig.maxRound <= MIN_ROUNDS
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronDown className="h-4 w-4 text-[#e9c46a]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
