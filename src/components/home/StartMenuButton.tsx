// src/components/game/StartMenuButton.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { AvatarSelector } from "../avatar/AvatarSelectorHome";
import { socketService } from "@/service/socketService";
import { usePlayerStore } from "@/utils/usePlayerStore";

interface StartMenuButtonProps {
  gameStarted: boolean;
  onEndGame?: () => void;
  leaveRoom: () => void;
  isAdmin?: boolean;
}

export default function StartMenuButton({
  gameStarted,
  onEndGame,
  leaveRoom,
  isAdmin = false,
}: StartMenuButtonProps) {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.roomId;
  const [open, setOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const { player, updatePlayerName, regenerateAvatar } = usePlayerStore();
  const { t } = useTranslation("common");

  const handleHome = () => {
    setOpen(false);
    leaveRoom();
    router.push("/");
  };

  const handleEndGame = () => {
    setOpen(false);
    onEndGame?.();
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePlayerName(e.target.value);
  };

  const handleSave = () => {
    setEditProfile(false);
    setOpen(false);
    if (roomId) {
      socketService.updatePlayer(roomId as string, player);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="bg-yellow-400 text-black font-bold border-2 border-black rounded-md shadow-md text-lg"
          >
            ≡
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-60 bg-black border-4 border-yellow-400 text-white rounded-md shadow-lg retro-font"
        >
          <div className="flex flex-col gap-4 text-sm px-2 py-1">
            <button
              onClick={handleHome}
              className="hover:underline hover:text-yellow-300 text-center"
            >
              🏠 {t("backHome")}
            </button>

            {gameStarted && isAdmin && (
              <>
                <div className="border-t border-yellow-500 my-1" />
                <button
                  onClick={handleEndGame}
                  className="hover:underline text-red-400 hover:text-red-300 text-center"
                >
                  ❌ {t("endGame")}
                </button>
              </>
            )}

            <div className="border-t border-yellow-500 my-1" />
            <button
              onClick={() => setEditProfile((prev) => !prev)}
              className="hover:underline hover:text-yellow-300 text-center"
            >
              ✏️ {t("editProfile")}
            </button>

            {editProfile && (
              <div className="space-y-2">
                <Input
                  className="text-black bg-white w-full rounded-sm px-2 py-1"
                  value={player.name}
                  onChange={handleChangeName}
                  placeholder={t("playerName")}
                />
                <AvatarSelector
                  regenerateAvatar={regenerateAvatar}
                  seed={player.avatar}
                />
                <Button
                  className="w-full bg-green-500 text-black font-semibold"
                  onClick={handleSave}
                >
                  💾 {t("save")}
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
