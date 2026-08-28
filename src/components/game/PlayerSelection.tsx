// src/components/game/PlayerSection.tsx
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Player } from "@/model/player";
import { CategoryCatalogEntry } from "@/model/category";
import { Users, CheckSquare, Square, Lock, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useTranslation } from "react-i18next";
import { RoomQRCode } from "./RoomQRCode";
import type React from "react";

// distinct per-player accent colors (readable on both light & dark skins)
const PLAYER_HUES = [
  "#22d3ee",
  "#f472b6",
  "#a3e635",
  "#fbbf24",
  "#818cf8",
  "#fb7185",
  "#34d399",
  "#c084fc",
];

type Props = {
  players: Player[];
  currentPlayerId?: string;
  myPlayerId?: string;
  availableCategories?: CategoryCatalogEntry[];
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  onRequestUnlockCategory?: (category: CategoryCatalogEntry) => void;
  purchasingCategoryKey?: string | null;
  onKickPlayer?: (playerId: string) => void;
  roomId: string;
  isAdmin: boolean;
};

export function PlayerSection({
  players,
  currentPlayerId,
  myPlayerId,
  availableCategories = [],
  selectedCategories,
  setSelectedCategories,
  onRequestUnlockCategory,
  purchasingCategoryKey,
  onKickPlayer,
  roomId,
  isAdmin,
}: Props) {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [animateNew, setAnimateNew] = useState<string | null>(null);

  const unlockedCategories = availableCategories
    .filter((cat) => cat.unlocked)
    .map((cat) => cat.key);

  useEffect(() => {
    if (unlockedCategories.length > 0) {
      setSelectedCategories(unlockedCategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      prev.length === unlockedCategories.length ? [] : [...unlockedCategories]
    );
  };

  return (
    <div className={theme.layout.card}>
      <RoomQRCode roomId={roomId} />

      {/* En-tête joueurs */}
      <div className="flex justify-between items-center mb-3">
        <h2 className={theme.playerSection.title}>
          <Users className={theme.playerSection.icon} />
          {t("playerSection.title", { count: players.length })}
        </h2>
        <span className={theme.playerSection.online}>
          <span className="skin-live-dot" aria-hidden />
          {t("playerSection.online")}
        </span>
      </div>

      {/* Liste des joueurs */}
      <ul className={theme.playerCard.container}>
        {players.map((player, i) => {
          const isCurrent = player.id === currentPlayerId;
          const isNew = animateNew === player.id;
          const hue = PLAYER_HUES[i % PLAYER_HUES.length];

          return (
            <li
              key={player.id}
              style={
                {
                  "--row-accent": hue,
                  borderColor: hue,
                } as React.CSSProperties
              }
              className={[
                theme.playerCard.item,
                "border-l-4",
                isCurrent ? theme.playerCard.highlight : theme.playerCard.hover,
                isNew ? theme.playerCard.newPlayer : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <div
                  className={theme.playerCard.avatar}
                  style={{ borderColor: hue }}
                >
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
              <div className="flex items-center gap-2">
                {isCurrent && (
                  <span className={theme.playerCard.badge}>
                    {t("playerSection.you")}
                  </span>
                )}
                {isAdmin && player.id !== myPlayerId && (
                  <button
                    onClick={() => onKickPlayer?.(player.id)}
                    title={t("playerSection.kick")}
                    aria-label={t("playerSection.kick")}
                    className="text-[color:var(--skin-danger)] opacity-70 hover:opacity-100 p-2 rounded-md hover:bg-[color:var(--skin-danger)]/10 active:scale-90 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
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
          <div className="flex items-center justify-between mb-3 gap-2">
            <h3 className={theme.lobby.sectionTitle}>{t("choose")}</h3>

            {isAdmin && (
              <button
                onClick={toggleAllCategories}
                className="skin-chip px-2.5 py-1 text-xs inline-flex items-center gap-1.5"
                title={
                  selectedCategories.length === unlockedCategories.length
                    ? t("unselectAll")
                    : t("selectAll")
                }
              >
                {selectedCategories.length === unlockedCategories.length ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                {selectedCategories.length === unlockedCategories.length
                  ? t("unselectAll")
                  : t("selectAll")}
              </button>
            )}
          </div>

          {/* Boutons de catégorie */}
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const selected = selectedCategories.includes(cat.key);
              const locked = !cat.unlocked;
              const label = t(`category.${cat.key.toLowerCase()}`);

              if (locked) {
                const purchasing = purchasingCategoryKey === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() =>
                      isAdmin && !purchasing && onRequestUnlockCategory?.(cat)
                    }
                    disabled={!isAdmin || purchasing}
                    className={`${theme.lobby.chip} skin-catchip-locked`}
                  >
                    {purchasing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[color:var(--skin-accent-2)]" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[color:var(--skin-accent-2)]" />
                    )}
                    {label}
                  </button>
                );
              }

              return (
                <button
                  key={cat.key}
                  onClick={() => toggleCategory(cat.key)}
                  disabled={!isAdmin}
                  className={`${theme.lobby.chip} ${
                    selected ? theme.lobby.chipOn : ""
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
