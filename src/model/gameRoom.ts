import { GameConfig } from "./gameConfig";
import { Player } from "./player";
import { QuizzType1Phases } from "./Quizz1Phases";
import { ComputedGuess } from "./computedGuesses";

export type GameRoom = {
  id: string;
  players: Player[];
  adminId: string;
  adminUserId?: string; // authenticated backend User.id of the room creator, if logged in
  currentRound: number;
  currentPlayer: Player;
  currentQuestion?: string;
  currentAnswer?: string;
  phase: QuizzType1Phases;
  guesses: Record<string, string>; // playerId -> guess (bluff or correct answer)
  votes: Record<string, string>; // voterId -> voted playerId
  categories?: string[]; // current categories for the round
  gameConfig: GameConfig;
  currentQuestionImageUrl?: string; // URL for the current question image
  currentCategory?: string; // category of the current question
  computedGuesses?: ComputedGuess[]; // present once results have been computed for the round
  isLastRound?: boolean;
  chatMessages?: ChatMessage[];
};

export type ChatMessage = {
  id: string;
  playerId: string;
  playerName: string;
  avatar?: string;
  text: string;
  ts: number;
};
