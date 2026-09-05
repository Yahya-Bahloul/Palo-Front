export type GameConfig = {
  maxRound: number;
  categories?: string[]; // categories selected by admin for the game
  all_categories?: boolean;
  lang: string;
  bonusMalusEnabled?: boolean;
  bonusMalusFrequency?: number; // deal a powerup every N rounds
};
