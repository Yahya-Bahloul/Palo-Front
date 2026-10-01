"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/service/authService";
import { billingService, CheckoutPlan } from "@/service/billingService";
import { useAuthStore } from "@/utils/useAuthStore";
import { CategoryCatalogEntry } from "@/model/category";
import { purchasesAvailable, purchasesService } from "@/service/purchasesService";

export function usePurchases() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, accessToken, logout } = useAuthStore();
  const [catalog, setCatalog] = useState<CategoryCatalogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [checkoutPending, setCheckoutPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmingCheckout, setConfirmingCheckout] = useState(false);

  const refreshCatalog = async (token: string) => {
    const refreshed = await authService.getCategoryCatalog(token);
    setCatalog(refreshed);
    return refreshed;
  };

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    refreshCatalog(accessToken).finally(() => setLoading(false));
  }, [accessToken, router]);

  // Stripe redirects back here with a `status` query param. Only the exact
  // literal strings "success" and "cancel" are recognized below — any other
  // value (including no param at all) shows neither banner. These strings
  // must match the STRIPE_CHECKOUT_SUCCESS_URL / STRIPE_CHECKOUT_CANCEL_URL
  // env vars configured in the sibling Palo-back repo's .env/CLAUDE.md.
  const checkoutStatus = searchParams.get("status");
  useEffect(() => {
    if (checkoutStatus !== "success" || !accessToken) return;

    // Entitlement-granting happens via an async Stripe webhook that races
    // the browser redirect back to this page — it frequently arrives after
    // we land here. Poll briefly instead of trusting a single immediate
    // fetch, so we don't show "confirmed" next to a still-locked catalog.
    let cancelled = false;
    setConfirmingCheckout(true);
    (async () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        if (attempt > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
        if (cancelled) return;
        const refreshed = await refreshCatalog(accessToken);
        if (refreshed.some((cat) => cat.isSubscribed)) break;
      }
      if (!cancelled) setConfirmingCheckout(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [checkoutStatus, accessToken]);

  const isSubscribed = catalog.some((cat) => cat.isSubscribed);
  const lockedCategories = catalog.filter((cat) => cat.isPremium && !cat.unlocked);

  // Not router.back(): after a Stripe checkout/portal redirect, the previous
  // history entry is the Stripe page itself.
  const close = () => router.replace("/");

  const handleSubscribe = async () => {
    if (!accessToken || !purchasesAvailable()) return;

    setSubscribing(true);
    setError(null);
    try {
      await purchasesService.purchasePremiumSubscription();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await refreshCatalog(accessToken);
      close();
    } catch {
      setError("purchaseFailed");
      setSubscribing(false);
    }
  };

  const redirectToCheckout = async (plan: CheckoutPlan) => {
    if (!accessToken) return;
    const pendingKey = plan.plan === "category" ? plan.categoryKey : plan.plan;
    setCheckoutPending(pendingKey);
    setError(null);
    try {
      const { url } = await billingService.createCheckoutSession(accessToken, plan);
      window.location.href = url;
    } catch {
      setError("purchaseFailed");
      setCheckoutPending(null);
    }
  };

  const handleSubscribeMonthlyWeb = () => redirectToCheckout({ plan: "monthly" });
  const handleSubscribeYearlyWeb = () => redirectToCheckout({ plan: "yearly" });
  const handleBuyCategoryWeb = (categoryKey: string) =>
    redirectToCheckout({ plan: "category", categoryKey });

  const handleManageSubscription = async () => {
    if (!accessToken) return;
    setError(null);
    try {
      const { url } = await billingService.createPortalSession(accessToken);
      window.location.href = url;
    } catch {
      setError("purchaseFailed");
    }
  };

  return {
    user,
    loading,
    logout,
    isSubscribed,
    lockedCategories,
    subscribing,
    checkoutPending,
    error,
    checkoutStatus,
    confirmingCheckout,
    handleSubscribe,
    handleSubscribeMonthlyWeb,
    handleSubscribeYearlyWeb,
    handleBuyCategoryWeb,
    handleManageSubscription,
    close,
    purchasesAvailable: purchasesAvailable(),
  };
}
