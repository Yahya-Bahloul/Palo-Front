// src/app/page.tsx
"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import TabSelector from "@/components/home/TabSelector";
import { useHomePage } from "./useHome";
import { AvatarSelector } from "@/components/avatar/avatarSelector";
import PlayerRangeIndicator from "@/components/home/PlayerRangeIndicator";

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <PlayerRangeIndicator />

      <Card className="w-full max-w-md bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-300 shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="space-y-6 p-6">
          <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "join" && (
            <div className="space-y-2">
              <Label htmlFor="room-code" className="text-amber-800 font-medium">
                {t("roomCode")}
              </Label>
              <Input
                id="room-code"
                placeholder={t("enterRoomCode")}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="rounded-lg border-amber-300 focus:ring-2 focus:ring-amber-500 uppercase tracking-wide text-black bg-white"
              />
            </div>
          )}
          <AvatarSelector
            regenerateAvatar={regenerateAvatar}
            seed={player.avatar}
          />

          <div className="space-y-2">
            <Label htmlFor="name" className="text-amber-800 font-medium">
              {t("playerName")}
            </Label>
            <Input
              id="name"
              placeholder={t("enterName")}
              value={player.name}
              onChange={(e) => updatePlayer({ name: e.target.value })}
              className="rounded-lg border-amber-300 focus:ring-2 focus:ring-amber-500 text-black bg-white"
            />
          </div>

          {/* 🧑‍🎨 Avatar Selector ici */}
        </CardContent>

        <CardFooter className="px-6 pb-6">
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
      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {activeTab === "join" ? t("joinNow") : t("createRoom")}
    </Button>
  );
}
