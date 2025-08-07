// src/hooks/useRoomPage.ts
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { socketService } from "@/service/socketService";
import { Player } from "@/model/player";
import { QuizzType1Phases } from "@/model/Quizz1Phases";
import { GameRoom } from "@/model/gameRoom";
import { GameConfig } from "@/model/gameConfig";
import { ComputedGuess } from "@/model/computedGuesses";
import { usePlayerStore } from "@/utils/usePlayerStore";
import { useTranslation } from "react-i18next";

function arraysAreEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((v) => b.includes(v));
}

export function useRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params ? params["roomId"] : undefined;
  const { i18n } = useTranslation();
  const { player } = usePlayerStore();

  const [players, setPlayers] = useState<Player[]>([]);
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
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    maxRound: 10,
    lang: i18n.language || "en",
  });

  const [currentCategories, setCurrentCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLastRound, setIsLastRound] = useState(false);
  const [computedGuesses, setComputedGuesses] = useState<ComputedGuess[]>([]);
  const [currentQuestionImageUrl, setCurrentQuestionImageUrl] = useState<
    string | undefined
  >(undefined);
  const [currentCategory, setCurrentCategory] = useState<string>("");

  const lastSentCategoriesRef = useRef<string[]>([]);

  const isAdmin = player.id === admin?.id;

  useEffect(() => {
    if (!roomId) return;

    if (!player.name || !player.avatar) {
      // 🚨 Pop-up or redirect logic here
      // For example, redirect to setup screen:
      router.push(`/setup?roomId=${roomId}`);
      return;
    }

    socketService.joinRoom(roomId as string, player);
  }, [roomId, player]);

  useEffect(() => {
    const handleJoinedRoom = (data: {
      room: GameRoom;
      availableCategories: string[];
    }) => {
      setPlayers(data.room.players);
      setAdmin(
        data.room.players.find((p) => p.id === data.room.adminId) || null
      );
      setAnswer(data.room.currentAnswer || "");
      setCurrentCategories(data.room.categories || []);
      setCurrentPlayer(data.room.currentPlayer || null);
      setGameConfig(data.room.gameConfig || { maxRound: 10 });
      setGameStarted(data.room.phase !== QuizzType1Phases.STARTING);
      setPhase(data.room.phase as QuizzType1Phases);
      setQuestion(data.room.currentQuestion || "");
      setCurrentQuestionImageUrl(
        data.room.currentQuestionImageUrl || undefined
      );
      setGuesses(data.room.guesses || {});
      setVotes(data.room.votes || {});
      setAvailableCategories(data.availableCategories || []);
      setSelectedCategories(data.room.gameConfig?.categories || []);
      setCurrentCategory(data.room.currentCategory || "");

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
    socketService.on("playerJoined", (data) => setPlayers(data.players));
    socketService.on("playerLeft", (data) => setPlayers(data.players));

    return () => {
      socketService.off("joinedRoom", handleJoinedRoom);
      socketService.off("playerJoined");
      socketService.off("playerLeft");
    };
  }, [player]);

  useEffect(() => {
    socketService.on("roundStarted", handleRoundStarted);
    socketService.on("questionReady", handleQuestionReady);
    socketService.on("votingStarted", handleVotingStarted);
    socketService.on("resultsReady", handleResultsReady);
    socketService.on("gameEnded", handleGameEnded);
    socketService.on("guessSubmitted", (data) => setGuesses(data.guesses));
    socketService.on("voteSubmitted", (data) => setVotes(data.votes));
    socketService.on("categoriesForRound", (data) => {
      setCurrentCategories(data.categories);
      console.log("aaaa");
      setCurrentCategory("");
    });
    socketService.on("showFinalResult", handleFinalResults);
    socketService.on("playerUpdated", (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    socketService.on("adminSelectedCategories", (data) => {
      if (!isAdmin) {
        setSelectedCategories(data.categories);
      }
    });

    return () => {
      socketService.off("roundStarted", handleRoundStarted);
      socketService.off("questionReady", handleQuestionReady);
      socketService.off("votingStarted", handleVotingStarted);
      socketService.off("resultsReady", handleResultsReady);
      socketService.off("gameEnded", handleGameEnded);
      socketService.off("guessSubmitted");
      socketService.off("voteSubmitted");
      socketService.off("categoriesForRound");
      socketService.off("adminSelectedCategories");
      socketService.off("playerUpdated");
    };
  }, [player]);

  useEffect(() => {
    if (!isAdmin || !roomId) return;
    if (!arraysAreEqual(selectedCategories, lastSentCategoriesRef.current)) {
      socketService.sendSelectedCategories(
        roomId as string,
        selectedCategories
      );
      lastSentCategoriesRef.current = selectedCategories;
    }
  }, [selectedCategories, isAdmin, roomId]);

  function handleRoundStarted(data: any) {
    setGameStarted(true);
    setWaitingForGameEnd(false);
    setCurrentPlayer(data.currentPlayer);
    setPhase(data.phase as QuizzType1Phases);
    setQuestion("");
    setCurrentQuestionImageUrl(undefined);
    setAnswer("");
    setTimer(60);
  }

  function handleQuestionReady(data: any) {
    setQuestion(data.currentQuestion);
    setAnswer(data.currentAnswer);
    setPhase(data.phase as QuizzType1Phases);
    setCurrentCategory(data.currentCategory || "");
    setCurrentQuestionImageUrl(data.currentQuestionImageUrl || null);
    setTimer(40);
  }

  function handleVotingStarted(data: any) {
    setGuesses(data.guesses);
    setPhase(QuizzType1Phases.VOTING);
    setTimer(30);
  }

  function handleResultsReady(data: any) {
    setPhase(data.phase as QuizzType1Phases);
    setComputedGuesses(data.computedGuesses);
    setVotes(data.votes);
    setPlayers(data.players);
    setIsLastRound(data.isLastRound || false);
  }

  function handleGameEnded(data: GameRoom) {
    setGameStarted(false);
    setCurrentPlayer(null);
    setQuestion("");
    setCurrentQuestionImageUrl(undefined);
    setAnswer("");
    setTimer(0);
    setPhase(QuizzType1Phases.STARTING);
    setGuesses({});
    setVotes({});
    setPlayers(data.players);
    setWaitingForGameEnd(false);
  }

  function handleFinalResults(data: any) {
    setPhase(QuizzType1Phases.FINAL_RESULTS);
    setPlayers(data.players);
  }

  function reconnectGameState(room: GameRoom) {
    setGameStarted(true);
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

  function showFinalResult() {
    socketService.forceFinalResults(roomId as string);
  }

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
    const allCategoriesSelected =
      availableCategories.length === selectedCategories.length;
    const config: GameConfig = {
      ...gameConfig,
      all_categories: allCategoriesSelected,
      categories: allCategoriesSelected ? [] : selectedCategories,
    };
    socketService.startGame(roomId as string, config);
  };

  const handleNextRound = () => {
    socketService.nextRound(roomId as string);
  };

  const handleChooseCategory = (category: string) => {
    socketService.chooseCategory(roomId as string, category);
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
    handleChooseCategory,
    handleSubmitGuess,
    handleSubmitVote,
    handleNextRound,
    endGame,
    isMyTurn: player.id === currentPlayer?.id,
    isAdmin,
    gameConfig,
    setGameConfig,
    leaveRoom,
    currentCategories,
    showFinalResult,
    isLastRound,
    availableCategories,
    selectedCategories,
    setSelectedCategories,
    computedGuesses,
    currentQuestionImageUrl,
    currentCategory,
  };
}
