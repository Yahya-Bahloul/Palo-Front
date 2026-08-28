"use client";

import { useEffect, ReactNode } from "react";
import { purchasesService } from "@/service/purchasesService";
import { useAuthStore } from "@/utils/useAuthStore";

type Props = { children: ReactNode };

// Keeps RevenueCat's identity in sync with our own auth session — configure
// once, then log in/out of RevenueCat whenever the user signs in/out, so a
// purchase is only ever tied to the account someone is actually playing under.
export function PurchasesInitializer({ children }: Props) {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    purchasesService.configure();
  }, []);

  useEffect(() => {
    if (user) {
      purchasesService.logIn(user.id);
    } else {
      purchasesService.logOut();
    }
  }, [user]);

  return <>{children}</>;
}
