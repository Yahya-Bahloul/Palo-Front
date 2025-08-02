// src/hooks/useHomePage.ts
import { GameRoom } from "@/model";
import { socketService } from "@/service/socketService";
import { usePlayerStore } from "@/utils/usePlayerStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useHomePage() {
  const router = useRouter();

  const { player, updatePlayer, regenerateAvatar } = usePlayerStore();

  const [roomCode, setRoomCode] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");

  // ✅ Init player only once
  useEffect(() => {
    console.log(player);
    if (!player.id) {
      updatePlayer({
        id: crypto.randomUUID(),
        name: "",
        score: 0,
        avatar: Math.random().toString(36).substring(2, 10),
      });
    }
  }, [player.id, updatePlayer]);

  // ✅ Handle backend events
  useEffect(() => {
    const handleRoomCreated = (data: { id: string }) => {
      router.push(`/room/${data.id}`);
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
