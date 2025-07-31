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
import PlayerRangeIndicator from "@/components/home/PlayerRangeIndicator";
import { GameSettingsPanel } from "@/components/game/GameSettingsPanel";
import { QuizzType1Phases } from "@/model/Quizz1Phases";
import { theme } from "@/styles/theme";
import { CategorySection } from "@/components/game/CategorySection";
import { VoteBreakdownSection } from "@/components/game/VoteBreakdownSection";
import { ResultSection } from "@/components/game/ResultSection";

export default function RoomPage() {
  const {
    roomId,
    players,
    question,
    answer,
    timer,
    gameStarted,
    phase,
    guesses,
    votes,
    handleStartGame,
    handleSubmitGuess,
    handleSubmitVote,
    handleNextRound,
    isMyTurn,
    isAdmin,
    currentPlayer,
    waitingForGameEnd,
    endGame,
    gameConfig,
    setGameConfig,
    leaveRoom,
    availableCategories,
    handleChooseCategory,
    showFinalResult,
    isLastRound,
  } = useRoomPage();

  return (
    <div className={theme.layout.container}>
      <StartMenuButton
        gameStarted={phase !== QuizzType1Phases.STARTING}
        onEndGame={endGame}
        leaveRoom={leaveRoom}
        isAdmin={isAdmin}
      />
      <PlayerRangeIndicator />

      <div className={theme.layout.card}>
        <h1 className={theme.text.heading}>Salle {roomId}</h1>

        {waitingForGameEnd && <WaitingOverlay />}
        <CategorySectionPhase gameStarted={gameStarted} players={players} />

        {gameStarted && (
          <>
            <CategoryPhase
              phase={phase}
              isMyTurn={isMyTurn}
              categories={availableCategories}
              handleChooseCategory={handleChooseCategory}
              currentPlayerName={currentPlayer?.name || "Joueur"}
            />
            <BluffPhase
              phase={phase}
              handleSubmitGuess={handleSubmitGuess}
              question={question}
              answer={answer}
            />
            <VotePhase
              phase={phase}
              guesses={guesses}
              handleSubmitVote={handleSubmitVote}
              question={question}
            />
            <ResultPhase
              phase={phase}
              players={players}
              votes={votes}
              question={question}
              currentPlayerId={currentPlayer?.id || ""}
              guesses={guesses}
            />
            <Timer phase={phase} time={timer} />
          </>
        )}

        {!gameStarted && isAdmin && (
          <GameSettingsPanel
            gameConfig={gameConfig}
            setGameConfig={setGameConfig}
            isAdmin={isAdmin}
          />
        )}

        <StartOrNextButton
          gameStarted={gameStarted}
          phase={phase}
          isAdmin={isAdmin}
          handleStartGame={handleStartGame}
          handleNextRound={handleNextRound}
          endGame={endGame}
          isLastRound={isLastRound}
          showFinalResult={showFinalResult}
        />

        <PlayerFooterList
          players={players}
          phase={phase}
          guesses={guesses}
          votes={votes}
          currentPlayerId={currentPlayer?.id}
        />
      </div>
    </div>
  );
}

function CategorySectionPhase({
  gameStarted,
  players,
}: {
  gameStarted: boolean;
  players: Player[];
}) {
  if (gameStarted) return null;
  return <PlayerSection players={players} />;
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

function BluffPhase({
  phase,
  handleSubmitGuess,
  question,
  answer,
}: {
  phase: QuizzType1Phases;
  handleSubmitGuess: (guess: string) => void;
  question: string;
  answer: string;
}) {
  if (phase !== QuizzType1Phases.GUESSING) return null;
  return (
    <BluffSection
      question={question}
      handleSubmitGuess={handleSubmitGuess}
      answer={answer}
    />
  );
}

function VotePhase({
  phase,
  guesses,
  handleSubmitVote,
  question,
}: {
  phase: QuizzType1Phases;
  guesses: Record<string, string>;
  handleSubmitVote: (vote: string) => void;
  question: string;
}) {
  if (phase !== QuizzType1Phases.VOTING) return null;
  return (
    <VoteSection
      question={question}
      guesses={guesses}
      handleSubmitVote={handleSubmitVote}
    />
  );
}

function ResultPhase({
  phase,
  players,
  votes,
  question,
  currentPlayerId,
  guesses,
}: {
  phase: QuizzType1Phases;
  players: Player[];
  votes: Record<string, string>;
  question: string;
  currentPlayerId: string;
  guesses: Record<string, string>;
}) {
  if (phase === QuizzType1Phases.RESULTS) {
    return (
      <VoteBreakdownSection
        players={players}
        votes={votes}
        question={question}
        currentPlayerId={currentPlayerId}
        guesses={guesses}
      />
    );
  } else if (phase === QuizzType1Phases.FINAL_RESULTS) {
    return <ResultSection players={players} />;
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
  const isResults = phase === QuizzType1Phases.RESULTS;
  const isFinal = phase === QuizzType1Phases.FINAL_RESULTS;

  if (!gameStarted && isAdmin) {
    return (
      <button
        onClick={handleStartGame}
        className={`${theme.button.base} ${theme.button.start}`}
      >
        Démarrer la partie
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
            Passer à la prochaine question
          </button>
        )}
        {isLastRound && (
          <button
            onClick={showFinalResult}
            className={`${theme.button.base} ${theme.button.primary}`}
          >
            Voir le podium
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
        {`Revenir à l'écran d'accueil`}
      </button>
    );
  }

  return null;
}
