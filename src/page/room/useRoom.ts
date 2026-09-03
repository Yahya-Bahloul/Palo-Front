// src/hooks/useRoomPage.ts
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { socketService } from "@/service/socketService";
import { Player } from "@/model/player";
import { QuizzType1Phases } from "@/model/Quizz1Phases";
import { GameRoom, ChatMessage } from "@/model/gameRoom";
import { GameConfig } from "@/model/gameConfig";
import { ComputedGuess } from "@/model/computedGuesses";
import { CategoryCatalogEntry } from "@/model/category";
import { usePlayerStore } from "@/utils/usePlayerStore";
import { useAuthStore } from "@/utils/useAuthStore";
import { authService } from "@/service/authService";
import { purchasesService, purchasesAvailable } from "@/service/purchasesService";
import { useTranslation } from "react-i18next";

// Per-category purchases aren't offered yet (no RevenueCat offerings
// configured) — route to the subscription page instead until that's set up.
const CATEGORY_PURCHASES_ENABLED = false;

function arraysAreEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((v) => b.includes(v));
}

// The server sends an absolute `phaseDeadline` (epoch ms) plus its own clock
// as `serverNow`. Comparing the two gives the device's clock offset, so the
// countdown stays correct even on a phone whose clock is minutes off — and a
// client that reconnects mid-phase, or whose socket lagged, shows the real
// remaining time instead of restarting the full duration.
type PhaseTiming = { deadline: number; offsetMs: number } | null;

function readTiming(data: {
  phaseDeadline?: number;
  serverNow?: number;
}): PhaseTiming {
  if (!data?.phaseDeadline) return null;
  return {
    deadline: data.phaseDeadline,
    offsetMs: data.serverNow ? data.serverNow - Date.now() : 0,
  };
}

export function useRoomPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams?.get("roomId") ?? undefined;
  const { i18n, t } = useTranslation();
  const { player, setCurrentRoomId } = usePlayerStore();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [admin, setAdmin] = useState<Player | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState<
    string | undefined
  >(undefined);
  // Reset whenever the question changes, so the report button re-enables
  // for the new round instead of staying disabled from the previous one.
  const [hasReportedQuestion, setHasReportedQuestion] = useState(false);
  const [timer, setTimer] = useState(0);
  const [phaseTiming, setPhaseTiming] = useState<PhaseTiming>(null);
  const [guessRejectedNonce, setGuessRejectedNonce] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [phase, setPhase] = useState<QuizzType1Phases>(
    QuizzType1Phases.STARTING
  );
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [waitingForGameEnd, setWaitingForGameEnd] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    maxRound: 10,
    lang: i18n.language || "en",
  });

  const [currentCategories, setCurrentCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<
    CategoryCatalogEntry[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLastRound, setIsLastRound] = useState(false);
  const [computedGuesses, setComputedGuesses] = useState<ComputedGuess[]>([]);
  const [currentQuestionImageUrl, setCurrentQuestionImageUrl] = useState<
    string | undefined
  >(undefined);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [notice, setNotice] = useState<string | null>(null);
  const [purchasingCategoryKey, setPurchasingCategoryKey] = useState<
    string | null
  >(null);
  const noticeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const dismissNotice = () => {
    clearTimeout(noticeTimeoutRef.current);
    setNotice(null);
  };

  const lastSentCategoriesRef = useRef<string[]>([]);

  const isAdmin = player.id === admin?.id;
  const isAdminRef = useRef(isAdmin);
  isAdminRef.current = isAdmin;

  useEffect(() => {
    if (!roomId) return;

    if (!player.name || !player.avatar) {
      // 🚨 Pop-up or redirect logic here
      // For example, redirect to setup screen:
      router.push(`/setup?roomId=${roomId}`);
      return;
    }

    setCurrentRoomId(roomId);
    socketService.joinRoom(roomId as string, player);
  }, [roomId, player, setCurrentRoomId]);

  useEffect(() => {
    const handleJoinedRoom = (data: {
      room: GameRoom;
      availableCategories: CategoryCatalogEntry[];
    }) => {
      setPlayers(data.room.players);
      setAdmin(
        data.room.players.find((p) => p.id === data.room.adminId) || null
      );
      setAnswer(data.room.currentAnswer || "");
      setCurrentCategories(data.room.categories || []);
      setCurrentPlayer(data.room.currentPlayer || null);
      setGameConfig({
        maxRound: data.room.gameConfig?.maxRound ?? 10,
        lang: data.room.gameConfig?.lang || i18n.language || "en",
        categories: data.room.gameConfig?.categories,
      });
      setGameStarted(data.room.phase !== QuizzType1Phases.STARTING);
      setPhase(data.room.phase as QuizzType1Phases);
      setQuestion(data.room.currentQuestion || "");
      setCurrentQuestionId(data.room.currentQuestionId);
      setCurrentQuestionImageUrl(
        data.room.currentQuestionImageUrl || undefined
      );
      setGuesses(data.room.guesses || {});
      setVotes(data.room.votes || {});
      setAvailableCategories(data.availableCategories || []);
      setSelectedCategories(data.room.gameConfig?.categories || []);
      setCurrentCategory(data.room.currentCategory || "");
      setComputedGuesses(data.room.computedGuesses || []);
      setIsLastRound(data.room.isLastRound || false);
      setChatMessages(data.room.chatMessages || []);

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

    const handleYouWereKicked = () => {
      leaveRoom();
      setCurrentRoomId(null);
      router.push("/");
    };

    const handleChatMessage = (msg: ChatMessage) => {
      setChatMessages((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
      );
    };

    const handleJoinError = () => {
      setCurrentRoomId(null);
      router.replace("/?roomError=1");
    };

    // Rooms live only in the backend's memory, so a restart ends every game.
    // Without this the client sits on a dead socket retrying into a room that
    // no longer exists.
    const handleServerShuttingDown = () => {
      setCurrentRoomId(null);
      router.replace("/?roomError=1");
    };

    socketService.on("joinError", handleJoinError);
    socketService.on("serverShuttingDown", handleServerShuttingDown);

    socketService.on("joinedRoom", handleJoinedRoom);
    socketService.on("playerJoined", (data) => setPlayers(data.players));
    socketService.on("playerLeft", (data) => setPlayers(data.players));
    socketService.on("youWereKicked", handleYouWereKicked);
    socketService.on("chatMessage", handleChatMessage);

    return () => {
      socketService.off("joinedRoom", handleJoinedRoom);
      socketService.off("playerJoined");
      socketService.off("playerLeft");
      socketService.off("youWereKicked", handleYouWereKicked);
      socketService.off("chatMessage", handleChatMessage);
      socketService.off("joinError", handleJoinError);
      socketService.off("serverShuttingDown", handleServerShuttingDown);
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
      setCurrentCategory("");
    });
    socketService.on("showFinalResult", handleFinalResults);
    socketService.on("playerUpdated", (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    socketService.on("adminSelectedCategories", (data) => {
      if (!isAdminRef.current) {
        setSelectedCategories(data.categories);
      }
    });

    const handlePlayerLeftNotice = (data: { playerName: string }) => {
      clearTimeout(noticeTimeoutRef.current);
      setNotice(t("playerLeftNotice", { name: data.playerName }));
      noticeTimeoutRef.current = setTimeout(() => setNotice(null), 5000);
    };
    const handleCurrentPlayerChanged = (data: { currentPlayer: Player }) => {
      setCurrentPlayer(data.currentPlayer);
    };

    // Server-side backstop rejection (a crafted client can bypass the checks in
    // BluffSection). Bumping the nonce lets BluffSection re-open its input
    // instead of leaving the player stuck on "waiting for others".
    const handleGuessRejected = () => setGuessRejectedNonce((n) => n + 1);

    const handleQuestionReported = () => {
      clearTimeout(noticeTimeoutRef.current);
      setNotice(t("reportQuestionSentNotice"));
      noticeTimeoutRef.current = setTimeout(() => setNotice(null), 5000);
    };

    socketService.on("playerLeftNotice", handlePlayerLeftNotice);
    socketService.on("currentPlayerChanged", handleCurrentPlayerChanged);
    socketService.on("guessRejected", handleGuessRejected);
    socketService.on("questionReported", handleQuestionReported);

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
      socketService.off("playerLeftNotice", handlePlayerLeftNotice);
      socketService.off("currentPlayerChanged", handleCurrentPlayerChanged);
      socketService.off("guessRejected", handleGuessRejected);
      socketService.off("questionReported", handleQuestionReported);
      clearTimeout(noticeTimeoutRef.current);
    };
  }, [player, t]);

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
    setCurrentQuestionId(undefined);
    setCurrentQuestionImageUrl(undefined);
    setAnswer("");
    setPhaseTiming(readTiming(data));
  }

  function handleQuestionReady(data: any) {
    setQuestion(data.currentQuestion);
    setAnswer(data.currentAnswer);
    setCurrentQuestionId(data.currentQuestionId);
    setHasReportedQuestion(false);
    setPhase(data.phase as QuizzType1Phases);
    setCurrentCategory(data.currentCategory || "");
    setCurrentQuestionImageUrl(data.currentQuestionImageUrl || null);
    setPhaseTiming(readTiming(data));
  }

  function handleVotingStarted(data: any) {
    setGuesses(data.guesses);
    setPhase(QuizzType1Phases.VOTING);
    setPhaseTiming(readTiming(data));
  }

  function handleResultsReady(data: any) {
    setPhase(data.phase as QuizzType1Phases);
    setPhaseTiming(null);
    setComputedGuesses(data.computedGuesses);
    setVotes(data.votes);
    setPlayers(data.players);
    setIsLastRound(data.isLastRound || false);
  }

  function handleGameEnded(data: GameRoom) {
    setGameStarted(false);
    setCurrentPlayer(null);
    setQuestion("");
    setCurrentQuestionId(undefined);
    setCurrentQuestionImageUrl(undefined);
    setAnswer("");
    setPhaseTiming(null);
    setPhase(QuizzType1Phases.STARTING);
    setGuesses({});
    setVotes({});
    setPlayers(data.players);
    setWaitingForGameEnd(false);
  }

  function handleFinalResults(data: any) {
    setPhase(QuizzType1Phases.FINAL_RESULTS);
    setPlayers(data.players);
    setPhaseTiming(null);
  }

  function reconnectGameState(room: GameRoom) {
    setGameStarted(true);
    setCurrentPlayer(room.currentPlayer);
    setPhase(room.phase as QuizzType1Phases);
    setQuestion(room.currentQuestion || "");
    setAnswer(room.currentAnswer || "");
    setCurrentQuestionId(room.currentQuestionId);
    setGuesses(room.guesses || {});
    setVotes(room.votes || {});
    setComputedGuesses(room.computedGuesses || []);
    setIsLastRound(room.isLastRound || false);
    // Resumes the real remaining time: previously this restarted the phase's
    // full duration, so a player reconnecting at 0:38 of a 40s phase saw a
    // fresh 40s and was then cut off two seconds later.
    setPhaseTiming(readTiming(room));
  }

  function endGame() {
    socketService.endGame(roomId as string);
  }

  function leaveRoom() {
    socketService.leaveRoom(roomId as string);
  }

  function leaveAndGoHome() {
    socketService.leaveRoom(roomId as string);
    setCurrentRoomId(null);
    router.push("/");
  }

  function sendChatMessage(text: string) {
    if (!roomId || !text.trim()) return;
    socketService.sendChatMessage(roomId, {
      id: player.id,
      name: player.name,
      avatar: player.avatar,
    }, text);
  }

  // `message` is optional — a bare tap reports the question with no context.
  function handleReportQuestion(message?: string) {
    if (!roomId || !currentQuestionId || hasReportedQuestion) return;
    socketService.reportQuestion(roomId, player.id, message?.trim() || undefined);
    setHasReportedQuestion(true);
  }

  function showFinalResult() {
    socketService.forceFinalResults(roomId as string);
  }

  // Ticks against the server deadline rather than decrementing a local counter,
  // so the displayed time self-corrects after a lag spike or a backgrounded tab
  // (mobile browsers throttle timers when the app isn't in the foreground).
  // Polls at 500ms so the visible second doesn't skip.
  useEffect(() => {
    if (!phaseTiming) {
      setTimer(0);
      return;
    }
    const tick = () => {
      const remainingMs =
        phaseTiming.deadline - (Date.now() + phaseTiming.offsetMs);
      setTimer(Math.max(0, Math.ceil(remainingMs / 1000)));
    };
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [phaseTiming]);

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

  const handleKickPlayer = (targetPlayerId: string) => {
    socketService.kickPlayer(roomId as string, targetPlayerId);
  };

  const handleRequestUnlockCategory = async (cat: CategoryCatalogEntry) => {
    if (!accessToken) {
      router.push("/login");
      return;
    }

    if (!CATEGORY_PURCHASES_ENABLED) {
      router.push("/purchases");
      return;
    }

    setPurchasingCategoryKey(cat.key);
    try {
      if (purchasesAvailable()) {
        // Real purchase: StoreKit/Play Billing → RevenueCat → our webhook grants
        // the entitlement server-side. Refresh shortly after to pick it up.
        try {
          await purchasesService.purchaseCategory(cat.key);
        } catch {
          clearTimeout(noticeTimeoutRef.current);
          setNotice(t("purchaseFailedNotice"));
          noticeTimeoutRef.current = setTimeout(() => setNotice(null), 5000);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const refreshed = await authService.getCategoryCatalog(accessToken);
        setAvailableCategories(refreshed);
        return;
      }

      // Plain web build: no native purchase flow available. Falls back to the
      // dev/test-only unlock endpoint, which the backend only allows when
      // ALLOW_TEST_UNLOCK is explicitly set — fails otherwise, since buying
      // is only possible from the mobile app (Play Store/App Store).
      try {
        await authService.unlockCategory(accessToken, cat.key);
      } catch {
        clearTimeout(noticeTimeoutRef.current);
        setNotice(t("purchaseWebUnavailableNotice"));
        noticeTimeoutRef.current = setTimeout(() => setNotice(null), 5000);
        return;
      }
      const refreshed = await authService.getCategoryCatalog(accessToken);
      setAvailableCategories(refreshed);
    } finally {
      setPurchasingCategoryKey(null);
    }
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
    guessRejectedNonce,
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
    handleKickPlayer,
    endGame,
    isMyTurn: player.id === currentPlayer?.id,
    isAdmin,
    hostId: admin?.id,
    gameConfig,
    setGameConfig,
    leaveRoom,
    leaveAndGoHome,
    currentCategories,
    showFinalResult,
    isLastRound,
    availableCategories,
    selectedCategories,
    setSelectedCategories,
    handleRequestUnlockCategory,
    purchasingCategoryKey,
    computedGuesses,
    currentQuestionImageUrl,
    currentCategory,
    notice,
    dismissNotice,
    chatMessages,
    sendChatMessage,
    currentQuestionId,
    hasReportedQuestion,
    handleReportQuestion,
  };
}
