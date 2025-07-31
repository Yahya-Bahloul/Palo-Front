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
import PlayerRangeIndicator from "@/components/home/PlayerRangeIndicator";
import { theme } from "@/styles/theme";

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
  } = useHomePage();

  return (
    <div className={theme.home.wrapper}>
      <PlayerRangeIndicator />

      <Card className={theme.home.card}>
        <CardContent className={theme.home.cardContent}>
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
                onChange={(e) => setRoomCode(e.target.value)}
                className={theme.home.input}
              />
            </div>
          )}

          <AvatarSelector
            regenerateAvatar={regenerateAvatar}
            seed={player.avatar}
          />

          <div className="space-y-2">
            <Label htmlFor="name" className={theme.home.label}>
              {t("playerName")}
            </Label>
            <Input
              id="name"
              placeholder={t("enterName")}
              value={player.name}
              onChange={(e) => updatePlayer({ name: e.target.value })}
              className={theme.home.input}
            />
          </div>
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
