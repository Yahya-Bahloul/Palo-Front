"use client";

// src/components/layout/StartMenuButton.tsx
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface StartMenuButtonProps {
  gameStarted: boolean;
  onEndGame?: () => void;
}

export default function StartMenuButton({
  gameStarted,
  onEndGame,
}: StartMenuButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleHome = () => {
    setOpen(false);
    router.push("/");
  };

  const handleEndGame = () => {
    setOpen(false);
    onEndGame?.();
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="bg-yellow-400 text-black font-bold px-3 py-2 border-2 border-black rounded-md shadow-md"
          >
            ≡
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-64 bg-black border-4 border-yellow-400 text-white rounded-md shadow-lg retro-font"
        >
          <div className="flex flex-col gap-4 text-sm px-2 py-1">
            <button
              onClick={handleHome}
              className="hover:underline hover:text-yellow-300 text-left"
            >
              🏠 Revenir à l’accueil
            </button>

            {gameStarted && (
              <>
                <div className="border-t border-yellow-500 my-1" />
                <button
                  onClick={handleEndGame}
                  className="hover:underline text-red-400 hover:text-red-300 text-left"
                >
                  ❌ Terminer la partie
                </button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
