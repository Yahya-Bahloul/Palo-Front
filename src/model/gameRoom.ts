import { Player } from "./player";
import { QuizzType1Phases } from "./Quizz1Phases";

export type GameRoom = {
  id: string;
  players: Player[];
  adminId: string;
  currentRound: number;
  currentPlayer: Player;
  currentQuestion?: string;
  currentAnswer?: string;
  phase: QuizzType1Phases;
  guesses: Record<string, string>; // playerId -> guess (bluff or correct answer)
  votes: Record<string, string>; // voterId -> voted playerId
};
