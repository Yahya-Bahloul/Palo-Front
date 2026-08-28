import { create } from "zustand";

const AUTH_KEY = "auth_data";

export type AuthUser = { id: string; email: string };

type PersistedAuth = { user: AuthUser | null; accessToken: string | null };

type AuthState = PersistedAuth & {
  setSession: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
};

function loadInitial(): PersistedAuth {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) return JSON.parse(saved);
  }
  return { user: null, accessToken: null };
}

function persist(state: PersistedAuth) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadInitial(),

  setSession: (user, accessToken) => {
    const next = { user, accessToken };
    set(next);
    persist(next);
  },

  logout: () => {
    const next = { user: null, accessToken: null };
    set(next);
    persist(next);
  },
}));
