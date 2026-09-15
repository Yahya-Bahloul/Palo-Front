"use client";

import { X, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";
import { usePurchases } from "./usePurchases";

export function PurchasesPage() {
  const { t } = useTranslation();
  const {
    loading,
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
    purchasesAvailable,
  } = usePurchases();

  if (loading) return null;

  const features = t("purchases.features", { returnObjects: true }) as string[];

  return (
    <div className={`${theme.home.wrapper} relative`}>
      <div className={`${theme.home.card} border-[3px] border-yellow-400 relative`}>
        <button
          onClick={close}
          aria-label={t("purchases.close")}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 hover:bg-white text-gray-700 shadow-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className={theme.home.cardContent}>
          <h1 className="text-3xl font-extrabold text-[#bc6c25] text-center pt-2">
            👑 {t("purchases.subscriptionTitle")}
          </h1>
          <p className="text-gray-600 text-sm text-center">
            {t("purchases.subscriptionDescription")}
          </p>

          <ul className="space-y-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-amber-200 shadow-sm"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </span>
                <span className="text-gray-900 text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          {checkoutStatus === "success" && confirmingCheckout && (
            <p className="text-gray-500 text-sm text-center font-medium animate-pulse">
              {t("purchases.checkoutFinalizing")}
            </p>
          )}
          {checkoutStatus === "success" && !confirmingCheckout && (
            <p className="text-emerald-600 text-sm text-center font-medium">
              {t("purchases.checkoutSuccess")}
            </p>
          )}
          {checkoutStatus === "cancel" && (
            <p className="text-gray-500 text-sm text-center font-medium">
              {t("purchases.checkoutCanceled")}
            </p>
          )}
          {error && (
            <p className="text-rose-600 text-sm text-center font-medium">
              {t("purchases.purchaseFailed")}
            </p>
          )}

          {!purchasesAvailable && !isSubscribed && lockedCategories.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-amber-100">
              <p className="text-gray-700 text-sm font-semibold text-center">
                {t("purchases.lockedCategoriesTitle")}
              </p>
              {lockedCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleBuyCategoryWeb(cat.key)}
                  disabled={checkoutPending === cat.key}
                  className={`${theme.button.base} w-full flex justify-between items-center px-4 py-2 disabled:opacity-60`}
                >
                  <span>{cat.label}</span>
                  <span className="text-xs uppercase">{t("purchases.buyCategory")}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={theme.home.cardFooter}>
          {isSubscribed ? (
            <div className="space-y-2">
              <p className="text-emerald-600 text-center font-semibold py-1">
                ✓ {t("purchases.subscriptionActive")}
              </p>
              {!purchasesAvailable && (
                <button
                  onClick={handleManageSubscription}
                  className={`${theme.button.base} ${theme.button.primary}`}
                >
                  {t("purchases.manageSubscription")}
                </button>
              )}
            </div>
          ) : purchasesAvailable ? (
            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              className={`${theme.button.base} ${theme.button.primary} disabled:opacity-60`}
            >
              {subscribing ? t("purchases.subscribing") : t("purchases.subscribe")}
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleSubscribeMonthlyWeb}
                disabled={checkoutPending === "monthly"}
                className={`${theme.button.base} ${theme.button.primary} disabled:opacity-60`}
              >
                {t("purchases.subscribeMonthly")}
              </button>
              <button
                onClick={handleSubscribeYearlyWeb}
                disabled={checkoutPending === "yearly"}
                className={`${theme.button.base} disabled:opacity-60`}
              >
                {t("purchases.subscribeYearly")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
