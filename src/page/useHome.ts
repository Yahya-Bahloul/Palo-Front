import { GameRoom, Player } from "@/model";
import { socketService } from "@/service/socketService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PLAYER_KEY = "player";

export function useHomePage() {
  const router = useRouter();

  const [player, setPlayer] = useState<Player>({
    id: "",
    name: "",
    avatar: "",
    score: 0,
  });

  const [roomCode, setRoomCode] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");

  // ✅ Load player from localStorage or create new
  useEffect(() => {
    const stored = localStorage.getItem(PLAYER_KEY);
    const existing = stored ? (JSON.parse(stored) as Player) : ({} as Player);
    const newPlayer: Player = {
      id: existing.id || crypto.randomUUID(),
      name: existing.name || "",
      avatar: existing.avatar || generateRandomSeed(),
      score: existing.score || 0,
    };
    setPlayer(newPlayer);
    localStorage.setItem(PLAYER_KEY, JSON.stringify(newPlayer));
  }, []);

  useEffect(() => {
    const handleRoomCreated = (data: { room: { id: string } }) => {
      router.push(`/room/${data.room.id}`);
    };

    const handleJoinedRoom = (data: { room: GameRoom }) => {
      router.push(`/room/${data.room.id}`);
    };

    const handleError = (err: { message: string }) => {
      console.error("❌ Erreur backend:", err.message);
    };

    socketService.on("roomCreated", handleRoomCreated);
    socketService.on("joinedRoom", handleJoinedRoom);
    socketService.on("error", handleError);

    return () => {
      socketService.off("roomCreated", handleRoomCreated);
      socketService.off("joinedRoom", handleJoinedRoom);
      socketService.off("error", handleError);
    };
  }, [router]);

  const handleCreateRoom = () => {
    console.log("Creating room:", player);
    socketService.createRoom(player);
  };

  const handleJoinRoom = () => {
    console.log("Joining room:", roomCode, player);
    socketService.joinRoom(roomCode, player);
  };

  const updatePlayer = (partial: Partial<Player>) => {
    const updated = { ...player, ...partial };
    setPlayer(updated);
    localStorage.setItem(PLAYER_KEY, JSON.stringify(updated));
  };

  const regenerateAvatar = () => {
    updatePlayer({ avatar: generateRandomSeed() });
  };

  return {
    activeTab,
    setActiveTab,
    roomCode,
    setRoomCode,
    player,
    updatePlayer,
    handleCreateRoom,
    handleJoinRoom,
    regenerateAvatar,
  };
}

function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 10);
}
