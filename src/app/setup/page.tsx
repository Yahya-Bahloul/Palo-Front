"use client";

import SetupPage from "@/page/setupProfile/setupProfile";
import { Suspense } from "react";

export default function Setup() {
  return (
    <div>
      <Suspense fallback={<div>Chargement...</div>}>
        <SetupPage />
      </Suspense>
    </div>
  );
}
