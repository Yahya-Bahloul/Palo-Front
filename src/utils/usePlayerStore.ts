// src/store/playerStore.ts
import { create } from "zustand";
import { Player } from "@/model/player";

const PLAYER_KEY = "player_data";

function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 10);
}

function loadInitialPlayer(): Player {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(PLAYER_KEY);
    if (saved) return JSON.parse(saved);
  }
  return {
    id: "",
    name: "",
    score: 0,
    avatar: "",
  };
}

function persist(player: Player) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
  }
}

interface PlayerState {
  player: Player;
  updatePlayer: (partial: Partial<Player>) => void;
  updatePlayerName: (name: string) => void;
  regenerateAvatar: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: loadInitialPlayer(),

  updatePlayer: (partial) => {
    const updated = { ...get().player, ...partial };
    set({ player: updated });
    persist(updated);
  },

  updatePlayerName: (name) => {
    const updated = { ...get().player, name };
    set({ player: updated });
    persist(updated);
  },

  regenerateAvatar: () => {
    const updated = { ...get().player, avatar: generateRandomSeed() };
    set({ player: updated });
    persist(updated);
  },
}));
