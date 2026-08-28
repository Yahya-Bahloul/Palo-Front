import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";

const GOOGLE_WEB_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const GOOGLE_IOS_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID || "";
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "";

// Google Identity Services' web <script> flow is blocked inside a Capacitor
// WebView (Google's disallowed_useragent policy) — window.google never gets
// defined there even though the script loads. Native platforms must go
// through this plugin's OS-level Credential Manager / native SDKs instead.
export const nativeSocialLoginAvailable = () => Capacitor.isNativePlatform();

let initialized = false;

async function ensureInitialized() {
  if (initialized || !nativeSocialLoginAvailable()) return;

  await SocialLogin.initialize({
    google: GOOGLE_WEB_CLIENT_ID
      ? {
          webClientId: GOOGLE_WEB_CLIENT_ID,
          iOSClientId: GOOGLE_IOS_CLIENT_ID || undefined,
          iOSServerClientId: GOOGLE_WEB_CLIENT_ID,
          mode: "online",
        }
      : undefined,
    apple: APPLE_CLIENT_ID
      ? {
          clientId: APPLE_CLIENT_ID,
          useProperTokenExchange: true,
          useBroadcastChannel: true,
        }
      : undefined,
  });
  initialized = true;
}

export const socialLoginService = {
  async signInWithGoogle(): Promise<string> {
    await ensureInitialized();
    const { result } = await SocialLogin.login({
      provider: "google",
      options: {},
    });
    if (result.responseType !== "online" || !result.idToken) {
      throw new Error("Google sign-in did not return an idToken");
    }
    return result.idToken;
  },

  async signInWithApple(): Promise<string> {
    await ensureInitialized();
    const { result } = await SocialLogin.login({
      provider: "apple",
      options: {},
    });
    if (!result.idToken) {
      throw new Error("Apple sign-in did not return an idToken");
    }
    return result.idToken;
  },
};
