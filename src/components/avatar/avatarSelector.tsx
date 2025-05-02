// src/components/game/AvatarSelector.tsx
"use client";

import { RefreshCw } from "lucide-react";
import Image from "next/image";

const AVATAR_STYLE = "adventurer";

export function AvatarSelector({
  regenerateAvatar,
  seed = "",
}: {
  regenerateAvatar: () => void;
  seed?: string;
}) {
  const avatarUrl = `https://api.dicebear.com/8.x/${AVATAR_STYLE}/svg?seed=${encodeURIComponent(
    seed
  )}`;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-lg border border-amber-200 space-y-6 text-center">
      {seed && (
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border border-amber-300 bg-white shadow">
          <Image
            src={avatarUrl}
            alt="Avatar preview"
            width={96}
            height={96}
            unoptimized
          />
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={regenerateAvatar}
          className="flex items-center justify-center gap-2 bg-white border border-amber-400 text-amber-700 font-medium px-4 py-2 rounded-lg hover:bg-amber-100 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Générer un nouvel avatar
        </button>
      </div>
    </div>
  );
}
