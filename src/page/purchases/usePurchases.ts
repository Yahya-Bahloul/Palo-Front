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

  const checkoutStatus = searchParams.get("status");
  useEffect(() => {
    if (checkoutStatus === "success" && accessToken) {
      refreshCatalog(accessToken);
    }
  }, [checkoutStatus, accessToken]);

  const isSubscribed =
    catalog.length > 0 && catalog.every((cat) => !cat.isPremium || cat.unlocked);
  const lockedCategories = catalog.filter((cat) => cat.isPremium && !cat.unlocked);

  const close = () => router.back();

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
    handleSubscribe,
    handleSubscribeMonthlyWeb,
    handleSubscribeYearlyWeb,
    handleBuyCategoryWeb,
    handleManageSubscription,
    close,
    purchasesAvailable: purchasesAvailable(),
  };
}
