// src/components/game/PowerupTray.tsx
"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";
import type { Player, PowerupItem, PowerupType } from "@/model/player";
import type { QuizzType1Phases } from "@/model/Quizz1Phases";
import {
  POWERUP_ALLOWED_PHASES,
  POWERUP_ICONS,
  POWERUP_KIND,
  TARGETED_POWERUPS,
} from "@/model/powerups";

type Props = {
  myPowerups: PowerupItem[];
  armedPowerup: { id: string; type: PowerupType } | null;
  handleArmPowerup: (item: { id: string; type: PowerupType } | null) => void;
  handleUsePowerup: (
    powerupId: string,
    powerupType: PowerupType,
    targetPlayerId?: string
  ) => void;
  players: Player[];
  player: Player;
  phase: QuizzType1Phases;
};

export function PowerupTray({
  myPowerups,
  armedPowerup,
  handleArmPowerup,
  handleUsePowerup,
  players,
  player,
  phase,
}: Props) {
  const { t } = useTranslation();

  if (!myPowerups.length && !armedPowerup) return null;

  // Group same-type charges so repeat draws stack into one chip with a count,
  // instead of a growing wall of identical buttons.
  const grouped = new Map<PowerupType, PowerupItem[]>();
  for (const item of myPowerups) {
    const bucket = grouped.get(item.type);
    if (bucket) bucket.push(item);
    else grouped.set(item.type, [item]);
  }

  const targets = players.filter(
    (p) => p.id !== player.id && !p.joinedLate && p.connected !== false
  );

  // Tapping a chip only selects it (toggles). Firing it — self-buff or targeted
  // malus — always takes a second, deliberate action in the panel below.
  const handleChipTap = (type: PowerupType, items: PowerupItem[]) => {
    const usableNow = POWERUP_ALLOWED_PHASES[type].includes(phase);
    if (!usableNow) return;
    const item = items[0];
    handleArmPowerup(
      armedPowerup?.id === item.id ? null : { id: item.id, type }
    );
  };

  const shownType = armedPowerup?.type ?? null;
  const armedIsTargeted =
    !!armedPowerup && TARGETED_POWERUPS.includes(armedPowerup.type);

  return (
    <div className="flex flex-col gap-2">
      <div className={theme.powerUps.tray}>
        {Array.from(grouped.entries()).map(([type, items]) => {
          const Icon = POWERUP_ICONS[type];
          const kind = POWERUP_KIND[type];
          const usableNow = POWERUP_ALLOWED_PHASES[type].includes(phase);
          const isArmed = armedPowerup?.type === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => handleChipTap(type, items)}
              disabled={!usableNow}
              title={t(`bonusMalus.${type}`, type)}
              aria-pressed={isArmed}
              className={`${theme.powerUps.chip} ${
                kind === "bonus"
                  ? theme.powerUps.chipBonus
                  : theme.powerUps.chipMalus
              } ${isArmed ? theme.powerUps.chipArmed : ""} ${
                !usableNow ? theme.powerUps.chipDisabled : ""
              }`}
            >
              <Icon className={theme.powerUps.icon} aria-hidden="true" />
              {items.length > 1 && (
                <span className={theme.powerUps.count}>{items.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {shownType && (
        <div className={theme.powerUps.info}>
          <span className={theme.powerUps.infoTitle}>
            {t(`bonusMalus.${shownType}`, shownType)}
          </span>
          <span className={theme.powerUps.infoDesc}>
            {t(`bonusMalus.desc.${shownType}`, "")}
          </span>
        </div>
      )}

      {armedPowerup && (
        <div className={theme.powerUps.targetRow}>
          <p className={theme.powerUps.targetHint}>
            {armedIsTargeted
              ? t("bonusMalus.pickTarget", "Choisis une cible")
              : t("bonusMalus.confirmHint", "Activer ce pouvoir ?")}
          </p>

          {armedIsTargeted &&
            targets.map((target) => (
              <button
                key={target.id}
                type="button"
                onClick={() =>
                  handleUsePowerup(
                    armedPowerup.id,
                    armedPowerup.type,
                    target.id
                  )
                }
                title={target.name}
                className={theme.powerUps.targetAvatar}
              >
                <Image
                  src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${target.avatar}`}
                  alt={target.name}
                  width={40}
                  height={40}
                  unoptimized
                />
              </button>
            ))}

          {!armedIsTargeted && (
            <button
              type="button"
              onClick={() =>
                handleUsePowerup(armedPowerup.id, armedPowerup.type)
              }
              className={theme.powerUps.confirmChip}
            >
              {t("bonusMalus.use", "Utiliser")}
            </button>
          )}

          <button
            type="button"
            onClick={() => handleArmPowerup(null)}
            className={theme.powerUps.cancelChip}
          >
            {t("cancel", "Annuler")}
          </button>
        </div>
      )}
    </div>
  );
}
