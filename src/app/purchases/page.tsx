"use client";

import { Suspense } from "react";
import { PurchasesPage } from "@/page/purchases/Purchases";

export default function Purchases() {
  return (
    <Suspense fallback={null}>
      <PurchasesPage />
    </Suspense>
  );
}
