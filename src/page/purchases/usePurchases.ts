"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/service/authService";
import { useAuthStore } from "@/utils/useAuthStore";
import { CategoryCatalogEntry } from "@/model/category";
import { purchasesAvailable, purchasesService } from "@/service/purchasesService";

export function usePurchases() {
  const router = useRouter();
  const { user, accessToken, logout } = useAuthStore();
  const [catalog, setCatalog] = useState<CategoryCatalogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    authService
      .getCategoryCatalog(accessToken)
      .then(setCatalog)
      .finally(() => setLoading(false));
  }, [accessToken, router]);

  const isSubscribed =
    catalog.length > 0 && catalog.every((cat) => !cat.isPremium || cat.unlocked);

  const close = () => router.back();

  const handleSubscribe = async () => {
    if (!accessToken || !purchasesAvailable()) return;

    setSubscribing(true);
    setError(null);
    try {
      // Real purchase: Play Billing → RevenueCat → our webhook grants the
      // subscription entitlement server-side. Refresh shortly after to pick it up.
      await purchasesService.purchasePremiumSubscription();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await authService.getCategoryCatalog(accessToken);
      close();
    } catch {
      setError("purchaseFailed");
      setSubscribing(false);
    }
  };

  return {
    user,
    loading,
    logout,
    isSubscribed,
    subscribing,
    error,
    handleSubscribe,
    close,
    purchasesAvailable: purchasesAvailable(),
  };
}
