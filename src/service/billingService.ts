const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type CheckoutPlan = { plan: "monthly" | "yearly" };

async function post<T>(path: string, accessToken: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Request to ${path} failed: ${res.status}`);
  return res.json();
}

export const billingService = {
  createCheckoutSession: (accessToken: string, plan: CheckoutPlan) =>
    post<{ url: string }>("/api/billing/checkout", accessToken, plan),

  createPortalSession: (accessToken: string) =>
    post<{ url: string }>("/api/billing/portal", accessToken),
};
