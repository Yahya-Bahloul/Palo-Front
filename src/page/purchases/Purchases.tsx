"use client";

import { useState } from "react";
import { X, Check, Crown, Loader2, ShieldCheck, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { usePurchases } from "./usePurchases";

// Display-only prices — the amounts actually charged live in Stripe
// (STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY). Keep in sync when they change.
const MONTHLY_EUR = 4.99;
const YEARLY_EUR = 39.99;
const YEARLY_SAVING_PERCENT = Math.round((1 - YEARLY_EUR / (MONTHLY_EUR * 12)) * 100);

type WebPlan = "monthly" | "yearly";

export function PurchasesPage() {
  const { t, i18n } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<WebPlan>("yearly");
  const {
    loading,
    isSubscribed,
    subscribing,
    openingPortal,
    checkoutPending,
    error,
    checkoutStatus,
    confirmingCheckout,
    handleSubscribe,
    handleSubscribeMonthlyWeb,
    handleSubscribeYearlyWeb,
    handleManageSubscription,
    close,
    purchasesAvailable,
  } = usePurchases();

  const money = (amount: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const features = t("purchases.features", { returnObjects: true }) as string[];
  const checkoutBusy = checkoutPending === "monthly" || checkoutPending === "yearly";
  const busyMessage = subscribing
    ? t("loading.processingPurchase", "Achat en cours…")
    : checkoutBusy
      ? t("loading.redirectingPayment", "Redirection vers le paiement sécurisé…")
      : openingPortal
        ? t("loading.openingPortal", "Ouverture de la gestion de l’abonnement…")
        : null;
  const handleWebSubscribe =
    selectedPlan === "yearly" ? handleSubscribeYearlyWeb : handleSubscribeMonthlyWeb;

  const plans: { id: WebPlan; label: string; price: string; per: string; badge?: string }[] = [
    {
      id: "yearly",
      label: t("purchases.planYearly"),
      price: money(YEARLY_EUR),
      per: t("purchases.perYear"),
      badge: t("purchases.savePercent", { percent: YEARLY_SAVING_PERCENT }),
    },
    {
      id: "monthly",
      label: t("purchases.planMonthly"),
      price: money(MONTHLY_EUR),
      per: t("purchases.perMonth"),
    },
  ];

  const closeButton = (
    <button
      onClick={close}
      aria-label={t("purchases.close")}
      className="absolute top-3 end-3 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/70 hover:bg-white active:scale-95 text-gray-700 shadow-sm transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
    >
      <X className="w-5 h-5" aria-hidden="true" />
    </button>
  );

  if (loading) {
    return (
      <div className={`${theme.home.wrapper} relative`}>
        <div
          className={`${theme.home.card} border-[3px] border-yellow-400 relative`}
          aria-busy="true"
        >
          {closeButton}
          <div className="p-6 space-y-5 animate-pulse motion-reduce:animate-none">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100" />
            <div className="mx-auto h-7 w-40 rounded-lg bg-amber-100" />
            <div className="space-y-2">
              <div className="h-11 rounded-xl bg-amber-50" />
              <div className="h-11 rounded-xl bg-amber-50" />
              <div className="h-11 rounded-xl bg-amber-50" />
            </div>
            <div className="h-14 rounded-xl bg-amber-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.home.wrapper} relative`}>
      {busyMessage && <LoadingOverlay message={busyMessage} />}
      <div className={`${theme.home.card} border-[3px] border-yellow-400 relative`}>
        {closeButton}

        <div className={theme.home.cardContent}>
          <header className="flex flex-col items-center gap-2 pt-2 text-center">
            <span
              className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-md"
              aria-hidden="true"
            >
              <Crown className="w-8 h-8 text-white" strokeWidth={2.25} />
            </span>
            <h1 className="text-3xl font-extrabold text-[#bc6c25]">
              {t("purchases.subscriptionTitle")}
            </h1>
            <p className="text-gray-600 text-sm">{t("purchases.subscriptionDescription")}</p>
          </header>

          <ul className="space-y-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-amber-200 shadow-sm"
              >
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </span>
                <span className="text-gray-900 text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <div aria-live="polite" className="empty:hidden space-y-2">
            {checkoutStatus === "success" && confirmingCheckout && (
              <p className="flex items-center justify-center gap-2 text-gray-600 text-sm font-medium">
                <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                {t("purchases.checkoutFinalizing")}
              </p>
            )}
            {checkoutStatus === "success" && !confirmingCheckout && (
              <p className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                <Check className="w-4 h-4" aria-hidden="true" />
                {t("purchases.checkoutSuccess")}
              </p>
            )}
            {checkoutStatus === "cancel" && (
              <p className="text-gray-600 text-sm text-center font-medium">
                {t("purchases.checkoutCanceled")}
              </p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm text-center font-medium"
            >
              {t("purchases.purchaseFailed")}
            </p>
          )}

        </div>

        <div className={`${theme.home.cardFooter} pt-5`}>
          {isSubscribed ? (
            <div className="space-y-3">
              <p className="flex items-center justify-center gap-2 text-emerald-600 font-semibold py-1">
                <Check className="w-5 h-5" aria-hidden="true" />
                {t("purchases.subscriptionActive")}
              </p>
              {!purchasesAvailable && (
                <button
                  onClick={handleManageSubscription}
                  className={`${theme.button.base} ${theme.button.primary} min-h-12 flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  {t("purchases.manageSubscription")}
                </button>
              )}
            </div>
          ) : purchasesAvailable ? (
            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              className={`${theme.button.base} ${theme.button.primary} min-h-12 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer`}
            >
              {subscribing && (
                <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              )}
              {subscribing ? t("purchases.subscribing") : t("purchases.subscribe")}
            </button>
          ) : (
            <div className="space-y-4">
              <div
                role="radiogroup"
                aria-label={t("purchases.choosePlan")}
                className="grid grid-cols-2 gap-3"
              >
                {plans.map((plan) => {
                  const selected = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative flex flex-col items-center gap-0.5 rounded-2xl border-2 px-3 pb-3 pt-5 text-center transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                        selected
                          ? "border-amber-500 bg-amber-50 shadow-md"
                          : "border-amber-200 bg-white hover:border-amber-300"
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-2.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-bold uppercase text-white shadow-sm">
                          {plan.badge}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-gray-600">{plan.label}</span>
                      <span className="text-xl font-extrabold text-gray-900 tabular-nums">
                        {plan.price}
                      </span>
                      <span className="text-xs text-gray-500">{plan.per}</span>
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          selected ? "border-amber-500 bg-amber-500" : "border-amber-300 bg-white"
                        }`}
                      >
                        {selected && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleWebSubscribe}
                disabled={checkoutBusy}
                className={`${theme.button.base} ${theme.button.primary} min-h-12 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer`}
              >
                {checkoutBusy && (
                  <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                )}
                {checkoutBusy ? t("purchases.redirecting") : t("purchases.continue")}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {t("purchases.secureNote")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
