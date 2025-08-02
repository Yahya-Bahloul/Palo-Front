import { Player } from "./player";

export type ComputedGuess = {
  key: string;
  text: string;
  authorNames: string[];
  isCorrect: boolean;
  voters: Player[];
};
