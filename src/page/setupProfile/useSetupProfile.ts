// src/hooks/useSetup.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlayerStore } from "@/utils/usePlayerStore";

export function useSetupProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams?.get("roomId");
  const redirect = roomId ? `/room/${roomId}` : "/";

  const { player, updatePlayerName, regenerateAvatar } = usePlayerStore();

  const [name, setName] = useState(player.name || "");
  const [error, setError] = useState("");

  useEffect(() => {
    regenerateAvatar()
  }, []);

  useEffect(() => {
    if (player.name && player.avatar) {
      router.push(redirect);
    }
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Le nom ne peut pas être vide.");
      return;
    }

    updatePlayerName(name.trim());
    router.push(redirect);
  };

  return {
    name,
    setName,
    error,
    handleSave,
    player,
    regenerateAvatar,
  };
}
