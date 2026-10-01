const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type FeedbackType = "contact" | "feature" | "question";

export class FeedbackError extends Error {
  constructor(public status: number) {
    super(`Request failed: ${status}`);
  }
}

async function post(path: string, body: unknown, token?: string | null) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new FeedbackError(res.status);
}

export const feedbackService = {
  reportQuestion: (
    payload: {
      questionId?: string;
      questionText: string;
      category?: string;
      lang?: string;
      comment?: string;
    },
    token?: string | null
  ) => post("/api/reports/question", payload, token),

  sendFeedback: (
    payload: { type: FeedbackType; message: string; email?: string; lang?: string },
    token?: string | null
  ) => post("/api/feedback", payload, token),
};
