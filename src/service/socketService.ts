// src/service/socketService.ts
import { io } from "socket.io-client";
import { Player } from "@/model/player";
import { GameConfig } from "@/model/gameConfig";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});
socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);
});

export const socketService = {
  createRoom: (player: Player) => {
    socket.emit("createRoom", player);
  },

  joinRoom: (roomId: string, player: Player) => {
    socket.emit("joinRoom", { roomId, player });
  },

  startGame(roomId: string, config: GameConfig) {
    socket.emit("startGame", { roomId, config });
  },

  submitQuestion: (
    roomId: string,
    playerId: string,
    question: string,
    answer: string
  ) => {
    socket.emit("submitQuestion", { roomId, playerId, question, answer });
  },

  submitGuess: (roomId: string, playerId: string, bluff: string) => {
    socket.emit("submitGuess", { roomId, playerId, bluff });
  },

  submitVote: (roomId: string, voterId: string, targetId: string) => {
    socket.emit("submitVote", { roomId, voterId, targetId });
  },

  nextRound: (roomId: string) => {
    console.log("nextRound", roomId);
    socket.emit("nextRound", { roomId });
  },

  endGame: (roomId: string) => {
    socket.emit("endGame", { roomId });
  },

  leaveRoom: (roomId: string) => {
    socket.emit("leaveRoom", { roomId });
  },

  chooseCategory: (roomId: string, category: string) => {
    socket.emit("chooseCategory", { roomId, category });
  },

  forceFinalResults: (roomId: string) => {
    socket.emit("forceFinalResults", { roomId });
  },

  sendSelectedCategories: (roomId: string, categories: string[]) => {
    socket.emit("adminSelectedCategories", { roomId, categories });
  },

    updatePlayer: (roomId: string, player: Player) => {
    socket.emit("updatePlayer", { roomId, player });
  },

  on: socket.on.bind(socket),
  off: socket.off.bind(socket),
};
