const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class AdminApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(
  method: string,
  path: string,
  token: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_URL}/api/admin${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const data = await res.json();
      if (typeof data?.message === "string") message = data.message;
    } catch {}
    throw new AdminApiError(res.status, message);
  }
  return res.json();
}

export type ReportStatus = "open" | "resolved";

export type AdminReport = {
  id: string;
  questionId: string | null;
  questionText: string;
  category: string | null;
  lang: string | null;
  comment: string | null;
  status: ReportStatus;
  createdAt: string;
  reporterEmail: string | null;
  questionDisabled: boolean | null; // null = question not found
  openReportsForQuestion: number;
};

export type AdminFeedback = {
  id: string;
  type: "contact" | "feature" | "question";
  message: string;
  email: string | null;
  lang: string | null;
  status: ReportStatus;
  createdAt: string;
};

export type PeriodKey = "day" | "week" | "month" | "year";

export type AdminStats = {
  trackedSince: string | null;
  rooms: Record<PeriodKey, number>;
  players: Record<PeriodKey, number>;
};

export type AdminRoom = {
  id: string;
  phase: string;
  currentRound: number;
  maxRound: number;
  lang: string;
  currentCategory: string | null;
  phaseDeadline: number | null;
  hostEmail: string | null;
  players: {
    name: string;
    score: number;
    connected: boolean;
    joinedLate: boolean;
    isHost: boolean;
  }[];
};

export type AdminSubscription = {
  status: string;
  provider: string;
  currentPeriodEnd: string | null;
  effective: boolean;
};

export type AdminUser = {
  id: string;
  email: string;
  createdAt: string;
  signIn: "google" | "apple" | "unknown";
  subscription: AdminSubscription | null;
  categories: { key: string; source: string }[];
};

export type Paged = { total: number; page: number; pageSize: number };

export type AdminCategory = {
  key: string;
  label: string;
  isPremium: boolean;
  disabled: boolean;
  questionCount: number;
  disabledQuestionCount: number;
};

export type QuestionTranslation = {
  question: string;
  correct: string;
  wrongAnswers: string[];
};

export type AdminQuestion = {
  id: string;
  category: string;
  imageUrl: string | null;
  disabled: boolean;
  translations: Record<string, QuestionTranslation>;
};

export type QuestionFilters = {
  category?: string;
  search?: string;
  status?: "enabled" | "disabled" | "";
  page: number;
};

export const adminService = {
  me: (token: string) =>
    request<{ isAdmin: true; email: string }>("GET", "/me", token),

  inbox: (token: string) =>
    request<{ reports: number; feedback: number }>("GET", "/inbox", token),
  reports: (token: string, status: ReportStatus | "") =>
    request<AdminReport[]>("GET", `/reports?status=${status}`, token),
  setReportStatus: (token: string, id: string, status: ReportStatus) =>
    request("PATCH", `/reports/${id}`, token, { status }),
  feedback: (token: string, status: ReportStatus | "") =>
    request<AdminFeedback[]>("GET", `/feedback?status=${status}`, token),
  setFeedbackStatus: (token: string, id: string, status: ReportStatus) =>
    request("PATCH", `/feedback/${id}`, token, { status }),

  stats: (token: string) => request<AdminStats>("GET", "/stats", token),

  rooms: (token: string) => request<AdminRoom[]>("GET", "/rooms", token),

  users: (token: string, search: string, page: number) =>
    request<Paged & { users: AdminUser[] }>(
      "GET",
      `/users?search=${encodeURIComponent(search)}&page=${page}`,
      token
    ),
  grantSubscription: (token: string, userId: string, days: number | null) =>
    request("POST", `/users/${userId}/subscription`, token, { days }),
  revokeSubscription: (token: string, userId: string) =>
    request("DELETE", `/users/${userId}/subscription`, token),
  grantCategory: (token: string, userId: string, key: string) =>
    request("POST", `/users/${userId}/categories/${encodeURIComponent(key)}`, token),
  revokeCategory: (token: string, userId: string, key: string) =>
    request("DELETE", `/users/${userId}/categories/${encodeURIComponent(key)}`, token),

  categories: (token: string) =>
    request<AdminCategory[]>("GET", "/categories", token),
  setCategoryDisabled: (token: string, key: string, disabled: boolean) =>
    request("PATCH", `/categories/${encodeURIComponent(key)}`, token, { disabled }),

  questions: (token: string, f: QuestionFilters) => {
    const q = new URLSearchParams({ page: String(f.page) });
    if (f.category) q.set("category", f.category);
    if (f.search) q.set("search", f.search);
    if (f.status) q.set("status", f.status);
    return request<Paged & { questions: AdminQuestion[] }>(
      "GET",
      `/questions?${q}`,
      token
    );
  },
  setQuestionDisabled: (token: string, id: string, disabled: boolean) =>
    request("PATCH", `/questions/${id}`, token, { disabled }),
  updateQuestion: (
    token: string,
    id: string,
    data: { category?: string; translations?: Record<string, QuestionTranslation> }
  ) => request("PUT", `/questions/${id}`, token, data),
};
