// src/app/page.tsx
"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import TabSelector from "@/components/home/TabSelector";
import { useHomePage } from "./useHome";
import { AvatarSelector } from "@/components/avatar/AvatarSelectorHome";
import { theme } from "@/styles/theme";
import LanguageSelect from "@/components/utils/LanguageSelect";
import { HomeMenu } from "@/components/home/HomeMenu";

export default function HomePage() {
  const { t } = useTranslation("common");
  const {
    activeTab,
    setActiveTab,
    roomCode,
    setRoomCode,
    handleCreateRoom,
    handleJoinRoom,
    regenerateAvatar,
    player,
    updatePlayer,
    checkingRoom,
    joinError,
    clearJoinError,
    roomErrorPopup,
    dismissRoomErrorPopup,
  } = useHomePage();

  if (checkingRoom) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
        <div className="skin-category-title text-[color:var(--skin-primary)] neon-text-glow [font-size:clamp(2rem,10vw,3rem)]">
          PALO
        </div>
        <p className="font-arcade text-sm text-[color:var(--skin-muted)] animate-pulse">
          {t("reconnecting", "Reconnexion à la partie…")}
        </p>
      </div>
    );
  }

  return (
    <div className={`${theme.home.wrapper} relative`}>
      <HomeMenu />
      <LanguageSelect />

      {roomErrorPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) dismissRoomErrorPopup();
          }}
        >
          <div className="w-full max-w-xs neon-card !rounded-[var(--skin-radius)] p-6 flex flex-col items-center text-center gap-4">
            <h2 className="font-display text-base text-[color:var(--skin-danger)]">
              {t("roomNotFoundTitle", "Salle introuvable")}
            </h2>
            <p className="text-sm text-[color:var(--skin-muted)] font-arcade">
              {t("joinRoomError", "Cette salle n’existe pas ou a été fermée.")}
            </p>
            <button
              onClick={dismissRoomErrorPopup}
              className="neon-btn w-full py-3 rounded-xl text-sm"
            >
              {t("ok", "OK")}
            </button>
          </div>
        </div>
      )}

      <Card className={theme.home.card}>
        <CardContent className={theme.home.cardContent}>
          <div className="text-center pt-2 pb-1">
            <h1 className="skin-category-title text-[color:var(--skin-primary)] neon-text-glow leading-tight [font-size:clamp(2.75rem,14vw,4rem)]">
              PALO
            </h1>
          </div>

          <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "join" && (
            <div className="space-y-2">
              <Label htmlFor="room-code" className={theme.home.label}>
                {t("roomCode")}
              </Label>
              <Input
                id="room-code"
                placeholder={t("enterRoomCode")}
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  clearJoinError();
                }}
                aria-invalid={!!joinError}
                className={`${theme.home.input} text-center font-arcade font-bold text-lg placeholder:tracking-normal placeholder:font-normal ${
                  roomCode ? "tracking-[0.3em]" : "tracking-normal"
                } ${joinError ? "!border-[color:var(--skin-danger)]" : ""}`}
                maxLength={6}
              />
              {joinError && (
                <p
                  role="alert"
                  className="text-xs font-arcade text-[color:var(--skin-danger)] text-center"
                >
                  {t("joinRoomError", "Cette salle n’existe pas ou a été fermée.")}
                </p>
              )}
            </div>
          )}

          <AvatarSelector
            regenerateAvatar={regenerateAvatar}
            seed={player.avatar}
          />

          {/* No visible label: the placeholder carries the hint, and the field
              keeps an accessible name through aria-label. */}
          <Input
            id="name"
            aria-label={t("playerName")}
            placeholder={t("enterName")}
            value={player.name}
            onChange={(e) => updatePlayer({ name: e.target.value })}
            className={theme.home.input}
          />
        </CardContent>

        <CardFooter className={theme.home.cardFooter}>
          <RoomActionButton
            activeTab={activeTab}
            name={player.name}
            roomCode={roomCode}
            onCreate={handleCreateRoom}
            onJoin={handleJoinRoom}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

function RoomActionButton({
  activeTab,
  name,
  roomCode,
  onCreate,
  onJoin,
}: {
  activeTab: "create" | "join";
  name: string;
  roomCode: string;
  onCreate: () => void;
  onJoin: () => void;
}) {
  const { t } = useTranslation("common");
  const disabled = activeTab === "join" ? !name || !roomCode : !name;

  return (
    <Button
      onClick={activeTab === "join" ? onJoin : onCreate}
      disabled={disabled}
      className={theme.home.actionButton}
    >
      {activeTab === "join" ? t("joinNow") : t("createRoom")}
    </Button>
  );
}
