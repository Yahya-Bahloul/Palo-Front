// src/store/playerStore.ts
import { create } from "zustand";
import { Player } from "@/model/player";

const PLAYER_KEY = "player_data";
const ROOM_KEY = "player_current_room";

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

function loadRoomId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROOM_KEY);
}

interface PlayerState {
  player: Player;
  /** the room this player currently belongs to (a player is in at most one) */
  currentRoomId: string | null;
  setCurrentRoomId: (roomId: string | null) => void;
  updatePlayer: (partial: Partial<Player>) => void;
  updatePlayerName: (name: string) => void;
  regenerateAvatar: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: loadInitialPlayer(),
  currentRoomId: loadRoomId(),

  setCurrentRoomId: (roomId) => {
    set({ currentRoomId: roomId });
    if (typeof window !== "undefined") {
      if (roomId) localStorage.setItem(ROOM_KEY, roomId);
      else localStorage.removeItem(ROOM_KEY);
    }
  },

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
