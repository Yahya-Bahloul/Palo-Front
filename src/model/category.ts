export type CategoryCatalogEntry = {
  key: string;
  label: string;
  isPremium: boolean;
  priceCents: number | null;
  unlocked: boolean;
  isSubscribed: boolean;
  /** Premium category that is free for everyone right now ("free of the week"). */
  freeThisWeek?: boolean;
  freeUntil?: string | null;
};
