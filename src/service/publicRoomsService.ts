const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type PublicRoom = {
  id: string;
  lang: string;
  playerCount: number;
  hostName: string | null;
};

export const publicRoomsService = {
  /** Open public lobbies, fullest first. */
  async list(): Promise<PublicRoom[]> {
    const res = await fetch(`${API_URL}/api/public-rooms`, { cache: "no-store" });
    if (!res.ok) throw new Error(`public-rooms failed: ${res.status}`);
    return res.json();
  },
};

/** Best room for a quick join: fullest one in the player's language, else the fullest overall. */
export function pickQuickRoom(rooms: PublicRoom[], lang: string): PublicRoom | null {
  const base = (lang || "").slice(0, 2);
  return rooms.find((r) => r.lang === base) ?? rooms[0] ?? null;
}
