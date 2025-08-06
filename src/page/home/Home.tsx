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
import { useEffect, useState } from "react";
import LanguageSelect from "@/components/utils/LanguageSelect";

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
    <div className={`${theme.home.wrapper} relative`}>
      <LanguageSelect />

      <Card
        className={`${theme.home.card} border-[3px] border-yellow-400 shadow-retro pixel-border`}
      >
        <CardContent className={`${theme.home.cardContent} retro-shadow`}>
          <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "join" && (
            <div className="space-y-2">
              <Label
                htmlFor="room-code"
                className={`${theme.home.label} font-mono`}
              >
                {t("roomCode")}
              </Label>
              <Input
                id="room-code"
                placeholder={t("enterRoomCode")}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className={`${theme.home.input} glow-effect`}
              />
            </div>
          )}

          <AvatarSelector
            regenerateAvatar={regenerateAvatar}
            seed={player.avatar}
          />

          <div className="space-y-2">
            <Label htmlFor="name" className={`${theme.home.label} font-mono`}>
              {t("playerName")}
            </Label>
            <Input
              id="name"
              placeholder={t("enterName")}
              value={player.name}
              onChange={(e) => updatePlayer({ name: e.target.value })}
              className={`${theme.home.input} glow-effect`}
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
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(activeTab === "join" ? !name || !roomCode : !name);
  }, [activeTab, name, roomCode]);

  return (
    <Button
      onClick={activeTab === "join" ? onJoin : onCreate}
      disabled={disabled}
      className={`${theme.home.actionButton} font-bold tracking-widest bg-yellow-500 text-black hover:bg-yellow-400 border border-black`}
    >
      {activeTab === "join" ? t("joinNow") : t("createRoom")}
    </Button>
  );
}
