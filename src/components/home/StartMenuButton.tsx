// src/components/game/StartMenuButton.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import { Menu, Home, LogOut, Pencil, Save } from "lucide-react";
import { theme } from "@/styles/theme";

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
  const searchParams = useSearchParams();
  const roomId = searchParams?.get("roomId");
  const [open, setOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const { player, updatePlayerName, regenerateAvatar, setCurrentRoomId } =
    usePlayerStore();
  const { t } = useTranslation("common");

  const handleHome = () => {
    setOpen(false);
    leaveRoom();
    setCurrentRoomId(null);
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

  const menuItem =
    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-arcade text-sm text-[color:var(--skin-text)] hover:bg-[color:var(--skin-primary)]/15 transition text-left";

  return (
    <div
      className="absolute left-4 z-50"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            aria-label={t("backHome")}
            className="skin-stepper"
          >
            <Menu className="h-5 w-5" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-64 p-2 neon-card !rounded-[calc(var(--skin-radius)*0.75)]"
        >
          <div className="flex flex-col gap-0.5">
            <button onClick={handleHome} className={menuItem}>
              <Home className="h-4 w-4 shrink-0" />
              {t("backHome")}
            </button>

            {gameStarted && isAdmin && (
              <button
                onClick={handleEndGame}
                className={`${menuItem} text-[color:var(--skin-danger)] hover:bg-[color:var(--skin-danger)]/15`}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {t("endGame")}
              </button>
            )}

            <div className="h-px my-1 bg-[color:var(--skin-border)]" />

            <button
              onClick={() => setEditProfile((prev) => !prev)}
              className={menuItem}
            >
              <Pencil className="h-4 w-4 shrink-0" />
              {t("editProfile")}
            </button>

            {editProfile && (
              <div className="space-y-2 p-2">
                <Input
                  className={theme.home.input}
                  value={player.name}
                  onChange={handleChangeName}
                  placeholder={t("playerName")}
                />
                <AvatarSelector
                  regenerateAvatar={regenerateAvatar}
                  seed={player.avatar}
                />
                <Button
                  className={theme.home.actionButton}
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4" />
                  {t("save")}
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
