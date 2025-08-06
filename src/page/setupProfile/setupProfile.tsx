// src/app/setup/page.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarSelector } from "@/components/avatar/AvatarSelectorHome";
import { useSetupProfile } from "./useSetupProfile";
import { theme } from "@/styles/theme";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function SetupPage() {
  const { t } = useTranslation();
  const { name, setName, error, handleSave, player, regenerateAvatar } =
    useSetupProfile();

  const isDisabled = name.trim() === "";
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <main className={theme.layout.container}>
      <div className={theme.home.card}>
        <div className={theme.home.cardContent}>
          <h1 className="text-xl font-bold text-center text-yellow-900">
            🧑‍🎮 {t("setup.title")}
          </h1>

          <div className="space-y-2">
            <label className={theme.text.label}>{t("setup.nameLabel")}</label>
            <Input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={theme.home.input}
              placeholder={t("setup.namePlaceholder")}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
            )}
          </div>

          <div className="space-y-2 pt-4">
            <label className={theme.text.label}>{t("setup.avatarLabel")}</label>
            <AvatarSelector
              seed={player.avatar}
              regenerateAvatar={regenerateAvatar}
            />
          </div>
        </div>

        <div className={theme.home.cardFooter + " pt-4"}>
          <Button
            disabled={isDisabled}
            className={theme.home.actionButton}
            onClick={handleSave}
          >
            {t("setup.save")}
          </Button>
        </div>
      </div>
    </main>
  );
}
