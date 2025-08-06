// src/components/game/PlayerSection.tsx
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Player } from "@/model/player";
import { UserRound, CheckSquare, Square } from "lucide-react";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useTranslation } from "react-i18next";
import { RoomQRCode } from "./RoomQRCode";

type Props = {
  players: Player[];
  currentPlayerId?: string;
  availableCategories?: string[];
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  roomId: string;
  isAdmin: boolean;
};

export function PlayerSection({
  players,
  currentPlayerId,
  availableCategories = [],
  selectedCategories,
  setSelectedCategories,
  roomId,
  isAdmin,
}: Props) {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [animateNew, setAnimateNew] = useState<string | null>(null);

  useEffect(() => {
    if (availableCategories.length > 0) {
      setSelectedCategories(availableCategories);
    }
  }, [availableCategories]);

  useEffect(() => {
    const lastPlayer = players[players.length - 1];
    if (lastPlayer && players.length > 0) {
      setAnimateNew(lastPlayer.id);
      const timer = setTimeout(() => setAnimateNew(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [players]);

  const toggleCategory = (category: string) => {
    if (!isAdmin) return;
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleAllCategories = () => {
    if (!isAdmin) return;
    setSelectedCategories((prev) =>
      prev.length === availableCategories.length ? [] : [...availableCategories]
    );
  };

  return (
    <div className={theme.layout.card}>
      <RoomQRCode roomId={roomId} />

      {/* En-tête joueurs */}
      <div className="flex justify-between items-center mb-2 text-[#f4a261]">
        <h2 className={theme.playerSection.title}>
          <UserRound className={theme.playerSection.icon} />
          {t("playerSection.title", { count: players.length })}
        </h2>
        <span className={theme.playerSection.online}>
          {t("playerSection.online")}
        </span>
      </div>

      {/* Liste des joueurs */}
      <ul className={theme.playerCard.container}>
        {players.map((player) => {
          const isCurrent = player.id === currentPlayerId;
          const isNew = animateNew === player.id;

          return (
            <li
              key={player.id}
              className={[
                theme.playerCard.item,
                theme.playerCard.baseBg,
                isCurrent ? theme.playerCard.highlight : theme.playerCard.hover,
                isNew ? theme.playerCard.newPlayer : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <div className={theme.playerCard.avatar}>
                  <Image
                    src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${player.avatar}`}
                    alt={player.name}
                    width={40}
                    height={40}
                    unoptimized
                  />
                </div>
                <span className={theme.playerCard.name}>{player.name}</span>
              </div>
              {isCurrent && (
                <span className={theme.playerCard.badge}>
                  {t("playerSection.you")}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {players.length === 0 && (
        <div className={theme.playerCard.placeholder}>
          {t("playerSection.waiting")}
        </div>
      )}

      {/* Catégories */}
      {availableCategories.length > 0 && (
        <div className="mt-6 w-full" dir={isRTL ? "rtl" : "ltr"}>
          <div className="flex items-center justify-center mb-4 gap-2">
            <h3 className="text-lg font-semibold text-white">{t("choose")}</h3>

            {isAdmin && (
              <button
                onClick={toggleAllCategories}
                className="bg-black border-yellow-300 p-1 rounded-md text-yellow-300 shadow-[2px_2px_0px_rgba(255,255,255,0.2)] hover:translate-y-[1px] transition-all"
                title={
                  selectedCategories.length === availableCategories.length
                    ? t("unselectAll")
                    : t("selectAll")
                }
              >
                {selectedCategories.length === availableCategories.length ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          {/* Boutons de catégorie */}
          <div className="flex flex-wrap justify-center gap-2">
            {availableCategories.map((cat) => {
              const selected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  disabled={!isAdmin}
                  className={`px-3 py-1 text-sm font-medium border transition-all duration-200
                    ${
                      selected
                        ? "bg-yellow-400 text-black border-yellow-500"
                        : "bg-white/30 text-white border-white/40"
                    }
                    rounded-md hover:scale-105 active:scale-95
                    ${
                      !isAdmin
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white/50"
                    }
                  `}
                >
                  {t(`category.${cat.toLowerCase()}`)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
