// src/app/setup/page.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarSelector } from "@/components/avatar/AvatarSelectorHome";
import { useSetupProfile } from "./useSetupProfile";
import { theme } from "@/styles/theme";
import { useEffect, useRef } from "react";

export default function SetupPage() {
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
            🧑‍🎮 Crée ton profil
          </h1>

          <div className="space-y-2">
            <label className={theme.text.label}>Ton nom :</label>
            <Input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={theme.home.input}
              placeholder="Entre ton nom"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
            )}
          </div>

          <div className="space-y-2 pt-4">
            <label className={theme.text.label}>Ton avatar :</label>
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
            ✅ Sauvegarder
          </Button>
        </div>
      </div>
    </main>
  );
}
