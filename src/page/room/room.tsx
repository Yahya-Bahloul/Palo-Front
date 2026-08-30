// src/app/room/page.tsx
"use client";

import { PlayerSection } from "@/components/game/PlayerSelection";
import { NoticeToast } from "@/components/game/NoticeToast";
import { BluffSection } from "@/components/game/BluffSection";
import { VoteSection } from "@/components/game/VoteSection";
import { Timer } from "@/components/game/Timer";
import { useRoomPage } from "./useRoom";
import type { Player } from "@/model/player";
import { PlayerFooterList } from "@/components/game/PlayerFooterStatus.tsx";
import { Loader2 } from "lucide-react";
import { WaitingForGameModal } from "@/components/game/WaitingForGameModal";
import StartMenuButton from "@/components/home/StartMenuButton";
import { GameSettingsPanel } from "@/components/game/GameSettingsPanel";
import { QuizzType1Phases } from "@/model/Quizz1Phases";
import { theme } from "@/styles/theme";
import { CategorySection } from "@/components/game/CategorySection";
import { VoteBreakdownSection } from "@/components/game/VoteBreakdownSection";
import { ResultSection } from "@/components/game/ResultSection";
import { Dispatch, SetStateAction } from "react";
import { ComputedGuess } from "@/model/computedGuesses";
import { CategoryCatalogEntry } from "@/model/category";
import { useTranslation } from "react-i18next"; // ✅
import { ChatPanel } from "@/components/game/ChatPanel";

export default function RoomPage() {
  const props = useRoomPage();
  const { t } = useTranslation(); // ✅

  const { gameStarted, waitingForGameEnd } = props;
  // A latecomer / spectator: sit in the lobby view and wait, don't render phases.
  const inLobby = !gameStarted || waitingForGameEnd;

  return (
    <div className={theme.layout.container}>
      <StartMenuButton {...props} onEndGame={props.endGame} />

      {props.notice && (
        <NoticeToast message={props.notice} onDismiss={props.dismissNotice} />
      )}

      {waitingForGameEnd && (
        <WaitingForGameModal onLeave={props.leaveAndGoHome} />
      )}

      {inLobby ? (
        <div className={theme.layout.lobbyScroll}>
          {waitingForGameEnd && (
            <div className="skin-panel p-3 flex items-center gap-2.5 text-left">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[color:var(--skin-primary)]" />
              <p className="text-xs text-[color:var(--skin-muted)] font-arcade">
                {t("waitingOverlay.title")}
              </p>
            </div>
          )}
          <GameStartingPhase
            {...props}
            gameStarted={false}
            roomId={props.roomId as string}
            myPlayerId={props.player.id}
            onRequestUnlockCategory={props.handleRequestUnlockCategory}
            onKickPlayer={props.handleKickPlayer}
          />
          {!waitingForGameEnd && props.isAdmin && (
            <GameSettingsPanel {...props} />
          )}
        </div>
      ) : (
        <div className={theme.layout.roomShell}>
          <Timer {...props} />
          {props.currentCategory !== "" && (
            <h1 className={theme.text.gameCategory}>
              {t(`category.${props.currentCategory}`)}
            </h1>
          )}
          <CategoryPhase
            {...props}
            categories={props.currentCategories}
            currentPlayerName={
              props.currentPlayer?.name || t("room.defaultPlayerName")
            }
          />
          <BluffPhase {...props} />
          <VotePhase {...props} />
          <ResultPhase
            {...props}
            currentPlayerId={props.currentPlayer?.id || ""}
          />
        </div>
      )}

      {gameStarted && !waitingForGameEnd && (
        <PlayerFooterList
          {...props}
          currentPlayerId={props.currentPlayer?.id}
        />
      )}

      <ChatPanel
        messages={props.chatMessages}
        myPlayerId={props.player.id}
        onSend={props.sendChatMessage}
        bottomOffsetRem={
          // clear the floating action button (lobby ~7rem) or the player footer (in-game ~5.25rem)
          !gameStarted && hasRoomAction(props) ? 8 : 5.25
        }
      />

      {/* Fixed action bar: Start (lobby) / Next / Results — sits above the footer in-game */}
      {!waitingForGameEnd && hasRoomAction(props) && (
        <div
          className="fixed left-0 right-0 z-40 px-4 pt-8 pb-3 bg-gradient-to-t from-[color:var(--skin-bg)] from-60% to-transparent"
          style={{
            bottom:
              gameStarted && !waitingForGameEnd
                ? "calc(env(safe-area-inset-bottom, 0px) + 5rem)"
                : "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
          }}
        >
          <div className="max-w-md mx-auto">
            <StartOrNextButton {...props} />
          </div>
        </div>
      )}
    </div>
  );
}

function GameStartingPhase(props: {
  gameStarted: boolean;
  players: Player[];
  availableCategories: CategoryCatalogEntry[];
  currentPlayerId?: string;
  myPlayerId?: string;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  onRequestUnlockCategory?: (category: CategoryCatalogEntry) => void;
  purchasingCategoryKey?: string | null;
  onKickPlayer?: (playerId: string) => void;
  roomId: string;
  isAdmin: boolean;
  hostId?: string;
}) {
  if (props.gameStarted) return null;
  return <PlayerSection {...props} />;
}

function CategoryPhase({
  phase,
  isMyTurn,
  categories,
  handleChooseCategory,
  currentPlayerName,
}: {
  phase: QuizzType1Phases;
  isMyTurn: boolean;
  categories: string[];
  handleChooseCategory: (category: string) => void;
  currentPlayerName: string;
}) {
  if (phase !== QuizzType1Phases.CATEGORIES || !categories.length) return null;
  return (
    <CategorySection
      isMyTurn={isMyTurn}
      categories={categories}
      handleChooseCategory={handleChooseCategory}
      currentPlayerName={currentPlayerName}
    />
  );
}

function BluffPhase(props: {
  phase: QuizzType1Phases;
  handleSubmitGuess: (guess: string) => void;
  question: string;
  answer: string;
  currentQuestionImageUrl?: string;
  guessRejectedNonce: number;
}) {
  if (props.phase !== QuizzType1Phases.GUESSING) return null;
  return <BluffSection {...props} />;
}

function VotePhase(props: {
  phase: QuizzType1Phases;
  guesses: Record<string, string>;
  handleSubmitVote: (vote: string) => void;
  question: string;
  currentQuestionImageUrl?: string;
}) {
  if (props.phase !== QuizzType1Phases.VOTING) return null;
  return <VoteSection {...props} />;
}

function ResultPhase(props: {
  phase: QuizzType1Phases;
  players: Player[];
  votes: Record<string, string>;
  question: string;
  currentPlayerId: string;
  guesses: Record<string, string>;
  computedGuesses: ComputedGuess[];
}) {
  if (props.phase === QuizzType1Phases.RESULTS) {
    return <VoteBreakdownSection {...props} />;
  } else if (props.phase === QuizzType1Phases.FINAL_RESULTS) {
    return <ResultSection {...props} />;
  }
  return null;
}

function hasRoomAction({
  gameStarted,
  phase,
  isAdmin,
}: {
  gameStarted: boolean;
  phase: QuizzType1Phases;
  isAdmin: boolean;
}) {
  if (!isAdmin) return false;
  if (!gameStarted) return true;
  return (
    phase === QuizzType1Phases.RESULTS ||
    phase === QuizzType1Phases.FINAL_RESULTS
  );
}

function StartOrNextButton({
  gameStarted,
  phase,
  isAdmin,
  handleStartGame,
  handleNextRound,
  endGame,
  showFinalResult,
  isLastRound,
}: {
  gameStarted: boolean;
  phase: QuizzType1Phases;
  isAdmin: boolean;
  handleStartGame: () => void;
  handleNextRound: () => void;
  endGame: () => void;
  showFinalResult: () => void;
  isLastRound?: boolean;
}) {
  const { t } = useTranslation(); // ✅
  const isResults = phase === QuizzType1Phases.RESULTS;
  const isFinal = phase === QuizzType1Phases.FINAL_RESULTS;

  const btn = "neon-btn w-full py-3.5 rounded-xl text-base";

  if (!gameStarted && isAdmin) {
    return (
      <button onClick={handleStartGame} className={btn}>
        {t("room.startGame")}
      </button>
    );
  }

  if (isResults && isAdmin) {
    return (
      <div className="flex flex-col space-y-2">
        {!isLastRound && (
          <button onClick={handleNextRound} className={btn}>
            {t("room.nextQuestion")}
          </button>
        )}
        {isLastRound && (
          <button onClick={showFinalResult} className={btn}>
            {t("room.showFinalResults")}
          </button>
        )}
      </div>
    );
  }

  if (isFinal && isAdmin) {
    return (
      <button onClick={endGame} className={btn}>
        {t("room.backHome")}
      </button>
    );
  }

  return null;
}
