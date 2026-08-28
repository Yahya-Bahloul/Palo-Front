"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/service/authService";
import { useAuthStore } from "@/utils/useAuthStore";
import {
  nativeSocialLoginAvailable,
  socialLoginService,
} from "@/service/socialLoginService";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const user = useAuthStore((s) => s.user);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const isNative = nativeSocialLoginAvailable();

  // Already signed in — no reason to be on the login page.
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const goHome = () => router.push("/");

  // Google Identity Services' web <script> flow never initializes inside a
  // Capacitor WebView (Google blocks it there) — only wire up the web button
  // path when we're actually in a browser.
  useEffect(() => {
    if (typeof window === "undefined" || !GOOGLE_CLIENT_ID || isNative) return;
    if (window.google) {
      setGoogleScriptLoaded(true);
      return;
    }
    // The gsi/client <Script> may still be loading — poll until it's available
    // instead of racing a one-shot effect against the network.
    const interval = setInterval(() => {
      if (window.google) {
        setGoogleScriptLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isNative]);

  useEffect(() => {
    const google = window.google;
    if (
      isNative ||
      !GOOGLE_CLIENT_ID ||
      !googleScriptLoaded ||
      !googleButtonRef.current ||
      !google
    ) {
      return;
    }

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const result = await authService.loginWithGoogle(response.credential);
        setSession(result.user, result.accessToken);
        router.replace("/");
      },
    });
    google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
    });
  }, [googleScriptLoaded, isNative, router, setSession]);

  const signInWithGoogleNative = async () => {
    const idToken = await socialLoginService.signInWithGoogle();
    const result = await authService.loginWithGoogle(idToken);
    setSession(result.user, result.accessToken);
    router.replace("/");
  };

  const signInWithApple = async () => {
    if (isNative) {
      const idToken = await socialLoginService.signInWithApple();
      const result = await authService.loginWithApple(idToken);
      setSession(result.user, result.accessToken);
      router.replace("/");
      return;
    }

    if (!APPLE_CLIENT_ID || !window.AppleID) return;
    window.AppleID.auth.init({
      clientId: APPLE_CLIENT_ID,
      scope: "email",
      redirectURI: window.location.origin,
      usePopup: true,
    });
    const { authorization } = await window.AppleID.auth.signIn();
    const result = await authService.loginWithApple(authorization.id_token);
    setSession(result.user, result.accessToken);
    router.replace("/");
  };

  return {
    goHome,
    googleButtonRef,
    signInWithGoogleNative,
    signInWithApple,
    isNative,
    googleConfigured: !!GOOGLE_CLIENT_ID,
    appleConfigured: !!APPLE_CLIENT_ID,
  };
}
