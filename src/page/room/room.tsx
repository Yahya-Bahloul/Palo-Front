// src/app/room/page.tsx
"use client";

import { PlayerSection } from "@/components/game/PlayerSelection";
import { BluffSection } from "@/components/game/BluffSection";
import { VoteSection } from "@/components/game/VoteSection";
import { Timer } from "@/components/game/Timer";
import { useRoomPage } from "./useRoom";
import type { Player } from "@/model/player";
import { PlayerFooterList } from "@/components/game/PlayerFooterStatus.tsx";
import { WaitingOverlay } from "@/components/game/WaitingOverlay";
import StartMenuButton from "@/components/home/StartMenuButton";
import { GameSettingsPanel } from "@/components/game/GameSettingsPanel";
import { QuizzType1Phases } from "@/model/Quizz1Phases";
import { theme } from "@/styles/theme";
import { CategorySection } from "@/components/game/CategorySection";
import { VoteBreakdownSection } from "@/components/game/VoteBreakdownSection";
import { ResultSection } from "@/components/game/ResultSection";
import { Dispatch, SetStateAction } from "react";
import { ComputedGuess } from "@/model/computedGuesses";
import { useTranslation } from "react-i18next"; // ✅

export default function RoomPage() {
  const props = useRoomPage();
  const { t } = useTranslation(); // ✅

  return (
    <div className={theme.layout.container}>
      <StartMenuButton {...props} />

      <div className={theme.layout.card}>
        <h1 className={theme.text.heading}>
          {props.currentCategory !== "" &&
            t(`category.${props.currentCategory}`)}
        </h1>

        {props.waitingForGameEnd && <WaitingOverlay />}
        <GameStartingPhase {...props} roomId={props.roomId as string} />

        {props.gameStarted && (
          <>
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
            <Timer {...props} />
          </>
        )}

        {!props.gameStarted && props.isAdmin && (
          <GameSettingsPanel {...props} />
        )}

        <StartOrNextButton {...props} />

        <PlayerFooterList
          {...props}
          currentPlayerId={props.currentPlayer?.id}
        />
      </div>
    </div>
  );
}

function GameStartingPhase(props: {
  gameStarted: boolean;
  players: Player[];
  availableCategories: string[];
  currentPlayerId?: string;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  roomId: string;
  isAdmin: boolean;
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

  if (!gameStarted && isAdmin) {
    return (
      <button
        onClick={handleStartGame}
        className={`${theme.button.base} ${theme.button.start}`}
      >
        {t("room.startGame")}
      </button>
    );
  }

  if (isResults && isAdmin) {
    return (
      <div className="flex flex-col space-y-2">
        {!isLastRound && (
          <button
            onClick={handleNextRound}
            className={`${theme.button.base} ${theme.button.start}`}
          >
            {t("room.nextQuestion")}
          </button>
        )}
        {isLastRound && (
          <button
            onClick={showFinalResult}
            className={`${theme.button.base} ${theme.button.primary}`}
          >
            {t("room.showFinalResults")}
          </button>
        )}
      </div>
    );
  }

  if (isFinal && isAdmin) {
    return (
      <button
        onClick={endGame}
        className={`${theme.button.base} ${theme.button.primary}`}
      >
        {t("room.backHome")}
      </button>
    );
  }

  return null;
}
