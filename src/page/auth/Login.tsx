"use client";

import Script from "next/script";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { theme } from "@/styles/theme";
import { useLogin } from "./useLogin";

export function LoginPage() {
  const { t } = useTranslation();
  const {
    goHome,
    googleButtonRef,
    signInWithGoogleNative,
    signInWithApple,
    isNative,
    googleConfigured,
    appleConfigured,
  } = useLogin();

  return (
    <>
      {!isNative && (
        <>
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
          />
          <Script
            src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
            strategy="afterInteractive"
          />
        </>
      )}
      <div className={`${theme.home.wrapper} relative`}>
        <button
          onClick={goHome}
          aria-label={t("close", "Fermer")}
          className="absolute right-4 z-50 skin-stepper"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
        >
          <X className="h-5 w-5" />
        </button>

        <div className={theme.home.card}>
          <div className={`${theme.home.cardContent} text-center pb-6`}>
            <h1 className="font-display text-2xl text-[color:var(--skin-primary)] neon-text-glow">
              {t("auth.title")}
            </h1>
            <p className="text-[color:var(--skin-muted)] font-arcade text-sm">
              {t("auth.subtitle")}
            </p>

            <div className="flex flex-col items-center gap-4 pt-2">
              {googleConfigured ? (
                isNative ? (
                  <button
                    onClick={signInWithGoogleNative}
                    className={theme.home.actionButton}
                  >
                    {t("auth.continueWithGoogle")}
                  </button>
                ) : (
                  <div ref={googleButtonRef} />
                )
              ) : (
                <p className="text-sm text-[color:var(--skin-muted)] italic font-arcade">
                  {t("auth.googleNotConfigured")}
                </p>
              )}

              {appleConfigured ? (
                <button
                  onClick={signInWithApple}
                  className={theme.home.actionButton}
                >
                  {t("auth.continueWithApple")}
                </button>
              ) : (
                <p className="text-sm text-[color:var(--skin-muted)] italic font-arcade">
                  {t("auth.appleNotConfigured")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
