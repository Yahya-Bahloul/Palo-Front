export type Player = {
  id: string; // généralement le socket.id
  name: string; // le nom du joueur
  score: number; // le score du joueur
  avatar?: string; // l'avatar du joueur (optionnel)
  joinedLate?: boolean; // indique si le joueur a rejoint la partie après son début
};
