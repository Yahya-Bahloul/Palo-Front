/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { socketService } from "@/service/socketService";
import { Player } from "@/model/player";
import { QuizzType1Phases } from "@/model/Quizz1Phases";
import { GameRoom } from "@/model/gameRoom";
import { GameConfig } from "@/model/gameConfig";

export function useRoomPage() {
  const { roomId } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [player, setPlayer] = useState<Player>({ id: "", name: "", score: 0 });
  const [round, setRound] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [admin, setAdmin] = useState<Player | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [phase, setPhase] = useState<QuizzType1Phases>(
    QuizzType1Phases.STARTING
  );
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [waitingForGameEnd, setWaitingForGameEnd] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig>({ maxRound: 10 }); // optional for display

  // Join room
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedPlayer = JSON.parse(localStorage.getItem("player") || "null");
    if (roomId && storedPlayer) {
      setPlayer({
        id: storedPlayer.id,
        name: storedPlayer.name,
        avatar: storedPlayer.avatar,
        score: 0,
      });
      socketService.joinRoom(roomId as string, storedPlayer);
    }
  }, [roomId]);

  // Listen to player and room updates
  useEffect(() => {
    const handleJoinedRoom = (data: { room: GameRoom }) => {
      setPlayers(data.room.players);
      setAdmin(
        data.room.players.find((p) => p.id === data.room.adminId) || null
      );

      // Reconnexion dans une partie déjà lancée
      if (data.room.phase !== QuizzType1Phases.STARTING) {
        const isInRoom = data.room.players.some(
          (p) => p.id === player.id && !p.joinedLate
        );
        if (isInRoom) {
          reconnectGameState(data.room);
        } else {
          setWaitingForGameEnd(true);
        }
      }
    };

    socketService.on("joinedRoom", handleJoinedRoom);
    socketService.on("playerJoined", (data) => setPlayers(data.room.players));
    socketService.on("playerLeft", (data) => setPlayers(data.room.players));

    return () => {
      socketService.off("joinedRoom", handleJoinedRoom);
      socketService.off("playerJoined");
      socketService.off("playerLeft");
    };
  }, [player]);

  // Game lifecycle events
  useEffect(() => {
    socketService.on("roundStarted", handleRoundStarted);
    socketService.on("questionSubmitted", handleQuestionSubmitted);
    socketService.on("votingStarted", handleVotingStarted);
    socketService.on("resultsReady", handleResultsReady);
    socketService.on("gameEnded", handleGameEnded);
    socketService.on("guessSubmitted", (data) => setGuesses(data.guesses));
    socketService.on("voteSubmitted", (data) => setVotes(data.votes));

    return () => {
      socketService.off("roundStarted", handleRoundStarted);
      socketService.off("questionSubmitted", handleQuestionSubmitted);
      socketService.off("votingStarted", handleVotingStarted);
      socketService.off("resultsReady", handleResultsReady);
      socketService.off("gameEnded", handleGameEnded);
      socketService.off("guessSubmitted");
      socketService.off("voteSubmitted");
    };
  }, [player]);

  function handleRoundStarted(data: any) {
    setGameStarted(true);
    setWaitingForGameEnd(false);
    setRound(data.currentRound);
    setCurrentPlayer(data.currentPlayer);
    setPhase(data.phase as QuizzType1Phases);
    setQuestion("");
    setAnswer("");
    setTimer(60);
  }

  function handleQuestionSubmitted(data: any) {
    setQuestion(data.currentQuestion);
    setAnswer(data.currentAnswer);
    setPhase(data.phase as QuizzType1Phases);
    setTimer(40);
  }

  function handleVotingStarted(data: any) {
    setGuesses(data.guesses);
    setPhase(QuizzType1Phases.VOTING);
    setTimer(30);
  }

  function handleResultsReady(data: any) {
    console.log("Results ready", data);
    setPhase(data.phase as QuizzType1Phases);
    setVotes(data.votes);
    setPlayers(data.players);
  }

  function handleGameEnded() {
    setGameStarted(false);
    setRound(1);
    setCurrentPlayer(null);
    setQuestion("");
    setAnswer("");
    setTimer(0);
    setPhase(QuizzType1Phases.STARTING);
    setGuesses({});
    setVotes({});
    setWaitingForGameEnd(false);
  }

  function reconnectGameState(room: GameRoom) {
    setGameStarted(true);
    setRound(room.currentRound);
    setCurrentPlayer(room.currentPlayer);
    setPhase(room.phase as QuizzType1Phases);
    setQuestion(room.currentQuestion || "");
    setAnswer(room.currentAnswer || "");
    setGuesses(room.guesses || {});
    setVotes(room.votes || {});
  }

  function endGame() {
    socketService.endGame(roomId as string);
  }

  function leaveRoom() {
    socketService.leaveRoom(roomId as string);
  }

  // Timer logic
  useEffect(() => {
    if (!gameStarted || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, gameStarted]);

  const handleStartGame = () => {
    socketService.startGame(roomId as string, gameConfig);
  };

  const handleNextRound = () => {
    socketService.nextRound(roomId as string);
  };

  const handleSubmitQuestion = () => {
    socketService.submitQuestion(roomId as string, player.id, question, answer);
  };

  const handleSubmitGuess = (bluff: string) => {
    socketService.submitGuess(roomId as string, player.id, bluff);
  };

  const handleSubmitVote = (targetId: string) => {
    socketService.submitVote(roomId as string, player.id, targetId);
  };

  return {
    roomId,
    player,
    players,
    round,
    currentPlayer,
    question,
    answer,
    timer,
    gameStarted,
    phase,
    guesses,
    votes,
    waitingForGameEnd,
    setQuestion,
    setAnswer,
    handleStartGame,
    handleSubmitQuestion,
    handleSubmitGuess,
    handleSubmitVote,
    handleNextRound,
    endGame,
    isMyTurn: player.id === currentPlayer?.id,
    isAdmin: player.id === admin?.id,
    gameConfig,
    setGameConfig,
    leaveRoom,
  };
}
