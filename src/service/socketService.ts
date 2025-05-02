// src/service/socketService.ts
import { io } from "socket.io-client";
import { Player } from "@/model/player";
import { GameConfig } from "@/model/gameConfig";

const socket = io("http://localhost:3001", {
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
    socket.emit("startGame", { roomId, ...config });
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

  on: socket.on.bind(socket),
  off: socket.off.bind(socket),
};
