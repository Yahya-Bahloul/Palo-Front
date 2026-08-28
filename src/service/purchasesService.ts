import { Capacitor } from "@capacitor/core";
import { Purchases } from "@revenuecat/purchases-capacitor";

const IOS_API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_IOS_API_KEY || "";
const ANDROID_API_KEY =
  process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY || "";

// RevenueCat's native SDK only runs inside the wrapped app (StoreKit/Play
// Billing require a real app install) — never in a plain browser tab.
export const purchasesAvailable = () => Capacitor.isNativePlatform();

let configured = false;

function apiKeyForPlatform(): string {
  return Capacitor.getPlatform() === "ios" ? IOS_API_KEY : ANDROID_API_KEY;
}

export const purchasesService = {
  async configure() {
    if (!purchasesAvailable() || configured) return;
    const apiKey = apiKeyForPlatform();
    if (!apiKey) return;

    await Purchases.configure({ apiKey });
    configured = true;
  },

  // Ties the RevenueCat identity to our own backend User.id, so a purchase
  // is only ever attached to the account someone actually plays under.
  async logIn(userId: string) {
    if (!purchasesAvailable() || !configured) return;
    await Purchases.logIn({ appUserID: userId });
  },

  async logOut() {
    if (!purchasesAvailable() || !configured) return;
    await Purchases.logOut();
  },

  async getOfferings() {
    if (!purchasesAvailable()) return null;
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  },

  async purchaseCategory(categoryKey: string) {
    const offering = await this.getOfferings();
    const pkg = offering?.availablePackages.find(
      (p) => p.identifier === categoryKey
    );
    if (!pkg) {
      throw new Error(`No RevenueCat package found for category "${categoryKey}"`);
    }
    return Purchases.purchasePackage({ aPackage: pkg });
  },

  async purchasePremiumSubscription() {
    const offering = await this.getOfferings();
    const pkg = offering?.monthly;
    if (!pkg) {
      throw new Error("No RevenueCat monthly package found for the premium subscription");
    }
    return Purchases.purchasePackage({ aPackage: pkg });
  },
};
