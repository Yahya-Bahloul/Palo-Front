"use client";

import Script from "next/script";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";
import { useLogin } from "./useLogin";

export function LoginPage() {
  const { t } = useTranslation();
  const {
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
        <div className={`${theme.home.card} border-[3px] border-yellow-400`}>
          <div className={`${theme.home.cardContent} text-center`}>
            <h1 className="text-3xl font-extrabold text-[#bc6c25]">
              🔑 {t("auth.title")}
            </h1>
            <p className="text-gray-700 text-sm">{t("auth.subtitle")}</p>

            <div className="flex flex-col items-center gap-4 pt-2">
              {googleConfigured ? (
                isNative ? (
                  <button
                    onClick={signInWithGoogleNative}
                    className={`${theme.button.base} ${theme.button.primary}`}
                  >
                    {t("auth.continueWithGoogle")}
                  </button>
                ) : (
                  <div ref={googleButtonRef} />
                )
              ) : (
                <p className="text-sm text-gray-500 italic">
                  {t("auth.googleNotConfigured")}
                </p>
              )}

              {appleConfigured ? (
                <button
                  onClick={signInWithApple}
                  className={`${theme.button.base} ${theme.button.primary}`}
                >
                  {t("auth.continueWithApple")}
                </button>
              ) : (
                <p className="text-sm text-gray-500 italic">
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
