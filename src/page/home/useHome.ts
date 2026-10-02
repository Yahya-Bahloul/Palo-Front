// src/hooks/useHomePage.ts
import { GameRoom } from "@/model";
import { socketService } from "@/service/socketService";
import { PublicRoom, pickQuickRoom, publicRoomsService } from "@/service/publicRoomsService";
import type { HomeTab } from "@/components/home/TabSelector";
import { usePlayerStore } from "@/utils/usePlayerStore";
import { useAuthStore } from "@/utils/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function useHomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { i18n } = useTranslation();

  const { player, updatePlayer, regenerateAvatar, currentRoomId, setCurrentRoomId } =
    usePlayerStore();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [roomCode, setRoomCode] = useState("");
  const [activeTab, setActiveTab] = useState<HomeTab>("create");
  const [publicRooms, setPublicRooms] = useState<PublicRoom[] | null>(null);
  const [publicRoomsError, setPublicRoomsError] = useState(false);
  const [publicRoomGone, setPublicRoomGone] = useState(false);
  const [checkingRoom, setCheckingRoom] = useState(!!currentRoomId);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [roomErrorPopup, setRoomErrorPopup] = useState(
    () => searchParams?.get("roomError") === "1"
  );

  useEffect(() => {
    if (searchParams?.get("roomError") === "1") {
      setRoomErrorPopup(true);
      window.history.replaceState(null, "", "/");
    }
  }, [searchParams]);

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
      setCurrentRoomId(data.id);
      router.push(`/room?roomId=${data.id}`);
    };

    const handleJoinedRoom = (data: { room: GameRoom }) => {
      setCurrentRoomId(data.room.id);
      router.push(`/room?roomId=${data.room.id}`);
    };

    const handleError = (err: { message: string }) => {
      console.error("❌ Erreur backend:", err.message);
    };

    const handleJoinError = () => {
      setJoinError("roomNotFound");
      setCurrentRoomId(null);
    };

    socketService.on("roomCreated", handleRoomCreated);
    socketService.on("joinedRoom", handleJoinedRoom);
    socketService.on("error", handleError);
    socketService.on("joinError", handleJoinError);

    return () => {
      socketService.off("roomCreated", handleRoomCreated);
      socketService.off("joinedRoom", handleJoinedRoom);
      socketService.off("error", handleError);
      socketService.off("joinError", handleJoinError);
    };
  }, [router, setCurrentRoomId]);

  // A player belongs to at most one room. If we think we're still in one,
  // ask the backend whether it exists and rejoin it — otherwise forget it.
  useEffect(() => {
    if (!currentRoomId) return;

    let done = false;
    const finish = (redirect: boolean) => {
      if (done) return;
      done = true;
      if (redirect) {
        router.replace(`/room?roomId=${currentRoomId}`);
      } else {
        setCurrentRoomId(null);
        setCheckingRoom(false);
      }
    };

    const onResult = (data: { roomId: string; exists: boolean }) => {
      if (data.roomId?.toUpperCase() !== currentRoomId.toUpperCase()) return;
      finish(data.exists);
    };

    socketService.on("roomCheckResult", onResult);
    socketService.checkRoom(currentRoomId);
    const t = setTimeout(() => finish(false), 4000);

    return () => {
      socketService.off("roomCheckResult", onResult);
      clearTimeout(t);
    };
  }, [currentRoomId, router, setCurrentRoomId]);

  const refreshPublicRooms = useCallback(() => {
    return publicRoomsService
      .list()
      .then((rooms) => {
        setPublicRooms(rooms);
        setPublicRoomsError(false);
      })
      .catch(() => setPublicRoomsError(true));
  }, []);

  // Keep the list of open public rooms fresh while the "online" tab is showing.
  useEffect(() => {
    if (activeTab !== "online") return;
    setPublicRoomGone(false);
    refreshPublicRooms();
    const id = setInterval(() => {
      if (!document.hidden) refreshPublicRooms();
    }, 5000);
    return () => clearInterval(id);
  }, [activeTab, refreshPublicRooms]);

  const handleCreateRoom = () => {
    socketService.createRoom(
      player,
      accessToken ?? undefined,
      i18n.language || "fr"
    );
  };

  const handleJoinRoom = () => {
    setJoinError(null);
    socketService.joinRoom(roomCode.trim().toUpperCase(), player);
  };

  const joinPublicRoom = (roomId: string) => {
    setJoinError(null);
    setPublicRoomGone(false);
    socketService.joinRoom(roomId, player);
  };

  const handleQuickPlay = () => {
    const room = pickQuickRoom(publicRooms ?? [], i18n.language);
    if (room) joinPublicRoom(room.id);
    else refreshPublicRooms();
  };

  // The room we tried to join started (or closed) in the meantime.
  useEffect(() => {
    if (joinError && activeTab === "online") {
      setPublicRoomGone(true);
      refreshPublicRooms();
    }
  }, [joinError, activeTab, refreshPublicRooms]);

  return {
    publicRooms,
    publicRoomsError,
    publicRoomGone,
    refreshPublicRooms,
    joinPublicRoom,
    handleQuickPlay,
    activeTab,
    setActiveTab,
    roomCode,
    setRoomCode,
    player,
    updatePlayer,
    handleCreateRoom,
    handleJoinRoom,
    regenerateAvatar,
    checkingRoom,
    joinError,
    clearJoinError: () => setJoinError(null),
    roomErrorPopup,
    dismissRoomErrorPopup: () => setRoomErrorPopup(false),
  };
}
