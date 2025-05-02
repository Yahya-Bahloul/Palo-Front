"use client";

import { GameConfig } from "@/model/gameConfig";
import { Settings, ChevronUp, ChevronDown } from "lucide-react";

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
    <div className="bg-black border-2 border-yellow-400 rounded-xl p-5  retro-font shadow-lg text-yellow-300 space-y-4">
      <div className="flex items-center text-red-500 mb-1">
        <Settings className="h-4 w-4 mr-2" />
        <h2 className="text-sm font-bold">PARAMÈTRES</h2>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-xs">Nombre de manches</label>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 text-xs bg-black border border-yellow-300 rounded-lg">
            {gameConfig.maxRound}
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={incrementRounds}
              disabled={gameConfig.maxRound >= MAX_ROUNDS}
              className={`rounded-full p-1 border border-yellow-300 hover:bg-yellow-900 hover:bg-opacity-30 transition ${
                gameConfig.maxRound >= MAX_ROUNDS
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              onClick={decrementRounds}
              disabled={gameConfig.maxRound <= MIN_ROUNDS}
              className={`rounded-full p-1 border border-yellow-300 hover:bg-yellow-900 hover:bg-opacity-30 transition ${
                gameConfig.maxRound <= MIN_ROUNDS
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
