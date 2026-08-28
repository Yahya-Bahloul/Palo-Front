import { CategoryCatalogEntry } from "@/model/category";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type AuthResult = {
  accessToken: string;
  user: { id: string; email: string };
};

async function request<T>(
  path: string,
  init: RequestInit,
  token?: string
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(`Request to ${path} failed: ${res.status}`);
  return res.json();
}

export const authService = {
  loginWithGoogle: (idToken: string) =>
    request<AuthResult>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),

  loginWithApple: (idToken: string) =>
    request<AuthResult>("/api/auth/apple", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),

  getCategoryCatalog: (accessToken: string) =>
    request<CategoryCatalogEntry[]>(
      "/api/entitlements",
      { method: "GET" },
      accessToken
    ),

  unlockCategory: (accessToken: string, categoryKey: string) =>
    request(
      "/api/entitlements/unlock-category",
      { method: "POST", body: JSON.stringify({ categoryKey }) },
      accessToken
    ),
};
