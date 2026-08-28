"use client";

import RoomPage from "@/page/room/room";
import { Suspense } from "react";

export default function Room() {
  return (
    <div>
      <Suspense fallback={<div>Chargement...</div>}>
        <RoomPage />
      </Suspense>
    </div>
  );
}
