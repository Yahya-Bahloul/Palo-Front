// src/components/layout/MainLayout.tsx
"use client";

import { PlayerSection } from "@/components/game/PlayerSelection";
import { QuizSection } from "@/components/game/QuizSection";
import { BluffSection } from "@/components/game/BluffSection";
import { VoteSection } from "@/components/game/VoteSection";
import { ResultSection } from "@/components/game/ResultSection";
import { Timer } from "@/components/game/Timer";
import { WaitingNotice } from "@/components/game/WaitingNotice";
import { useRoomPage } from "./useRoom";
import type { Player } from "@/model/player";
import { PlayerFooterList } from "@/components/game/PlayerFooterStatus.tsx";
import { WaitingOverlay } from "@/components/game/WaitingOverlay";
import StartMenuButton from "@/components/home/StartMenuButton";
import PlayerRangeIndicator from "@/components/home/PlayerRangeIndicator";
import { GameSettingsPanel } from "@/components/game/GameSettingsPanel";
import { QuizzType1Phases } from "@/model/Quizz1Phases";

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
    setQuestion,
    setAnswer,
    handleStartGame,
    handleSubmitQuestion,
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
  } = useRoomPage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <StartMenuButton
        gameStarted={phase !== QuizzType1Phases.STARTING}
        onEndGame={endGame}
        leaveRoom={leaveRoom}
        isAdmin={isAdmin}
      />
      <PlayerRangeIndicator />

      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold text-blue-100">Salle {roomId}</h1>

        {waitingForGameEnd && <WaitingOverlay />}
        <PlayerSectionPhase gameStarted={gameStarted} players={players} />

        {gameStarted && (
          <>
            <QuizPhase
              phase={phase}
              isMyTurn={isMyTurn}
              question={question}
              answer={answer}
              setQuestion={setQuestion}
              setAnswer={setAnswer}
              handleSubmitQuestion={handleSubmitQuestion}
            />
            <BluffPhase
              phase={phase}
              isMyTurn={isMyTurn}
              handleSubmitGuess={handleSubmitGuess}
              question={question}
              answer={answer}
            />
            <VotePhase
              phase={phase}
              isMyTurn={isMyTurn}
              guesses={guesses}
              handleSubmitVote={handleSubmitVote}
              question={question}
            />
            <ResultPhase phase={phase} players={players} votes={votes} />
            <Timer phase={phase} time={timer} />
            <WaitingMessage phase={phase} isMyTurn={isMyTurn} />
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

// -- Phased Subcomponents --

function PlayerSectionPhase({
  gameStarted,
  players,
}: {
  gameStarted: boolean;
  players: Player[];
}) {
  if (gameStarted) return <></>;
  return <PlayerSection players={players} />;
}

function QuizPhase({
  phase,
  isMyTurn,
  question,
  answer,
  setQuestion,
  setAnswer,
  handleSubmitQuestion,
}: {
  phase: QuizzType1Phases;
  isMyTurn: boolean;
  question: string;
  answer: string;
  setQuestion: (value: string) => void;
  setAnswer: (value: string) => void;
  handleSubmitQuestion: () => void;
}) {
  if (phase !== QuizzType1Phases.QUESTION || !isMyTurn) return null;
  return (
    <QuizSection
      question={question}
      answer={answer}
      setQuestion={setQuestion}
      setAnswer={setAnswer}
      handleSubmitQuestion={handleSubmitQuestion}
    />
  );
}

function BluffPhase({
  phase,
  isMyTurn,
  handleSubmitGuess,
  question,
  answer,
}: {
  phase: QuizzType1Phases;
  isMyTurn: boolean;
  handleSubmitGuess: (guess: string) => void;
  question: string;
  answer: string;
}) {
  if (phase !== QuizzType1Phases.GUESSING || isMyTurn) return null;
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
  isMyTurn,
  guesses,
  handleSubmitVote,
  question,
}: {
  phase: QuizzType1Phases;
  isMyTurn: boolean;
  guesses: Record<string, string>;
  handleSubmitVote: (vote: string) => void;
  question: string;
}) {
  if (phase !== QuizzType1Phases.VOTING || isMyTurn) return null;
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
}: {
  phase: QuizzType1Phases;
  players: Player[];
  votes: Record<string, string>;
}) {
  if (
    phase === QuizzType1Phases.RESULTS ||
    phase === QuizzType1Phases.FINAL_RESULTS
  ) {
    return (
      <ResultSection
        players={players}
        votes={votes}
        isFinalResult={phase === QuizzType1Phases.FINAL_RESULTS}
      />
    );
  }
  return null;
}

// -- Waiting Message --

function WaitingMessage({
  phase,
  isMyTurn,
}: {
  phase: QuizzType1Phases;
  isMyTurn: boolean;
}) {
  if (phase === QuizzType1Phases.QUESTION && !isMyTurn) {
    return (
      <WaitingNotice message="En attente que le joueur pose une question..." />
    );
  }

  if (phase === QuizzType1Phases.GUESSING && isMyTurn) {
    return (
      <WaitingNotice message="En attente des autres joueurs pour proposer leurs réponses..." />
    );
  }

  if (phase === QuizzType1Phases.VOTING && isMyTurn) {
    return (
      <WaitingNotice message="En attente des votes des autres joueurs..." />
    );
  }

  return null;
}

// -- Button Logic --

function StartOrNextButton({
  gameStarted,
  phase,
  isAdmin,
  handleStartGame,
  handleNextRound,
  endGame,
}: {
  gameStarted: boolean;
  phase: QuizzType1Phases;
  isAdmin: boolean;
  handleStartGame: () => void;
  handleNextRound: () => void;
  endGame: () => void;
}) {
  if (!gameStarted && isAdmin) {
    return (
      <button
        onClick={handleStartGame}
        className="w-full py-3 bg-yellow-600 text-white rounded-xl font-semibold text-base transition-all duration-200"
      >
        Démarrer la partie
      </button>
    );
  }

  if (phase === QuizzType1Phases.RESULTS && isAdmin) {
    return (
      <button
        onClick={handleNextRound}
        className="w-full py-3 bg-amber-500 text-white rounded-xl font-semibold text-base transition-all duration-200"
      >
        Passer à la prochaine question
      </button>
    );
  }

  if (phase === QuizzType1Phases.FINAL_RESULTS && isAdmin) {
    return (
      <button
        onClick={endGame}
        className="w-full py-3 bg-amber-500 text-white rounded-xl font-semibold text-base transition-all duration-200"
      >
        {`Revenir à l'écran d'accueil`}
      </button>
    );
  }

  return null;
}
