// src/hooks/useAvatar.ts
import { useEffect, useState } from "react";

const STORAGE_KEY = "avatarSeed";
const DEFAULT_STYLE = "adventurer";

function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function useAvatar(style: string = DEFAULT_STYLE) {
  const [seed, setSeed] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSeed(stored);
    } else {
      const newSeed = generateRandomSeed();
      localStorage.setItem(STORAGE_KEY, newSeed);
      setSeed(newSeed);
    }
  }, []);

  const avatarUrl = seed
    ? `https://api.dicebear.com/8.x/${style}/svg?seed=${encodeURIComponent(
        seed
      )}`
    : "";

  return { seed, avatarUrl };
}
