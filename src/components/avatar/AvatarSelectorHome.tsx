"use client";

import { RefreshCw } from "lucide-react";
import Image from "next/image";
import { theme } from "@/styles/theme";

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
    <div className={theme.avatarSelector.container}>
      {seed && (
        <div className={theme.avatarSelector.imageWrapper}>
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
          className={theme.avatarSelector.button}
        >
          <RefreshCw className={theme.avatarSelector.icon} />
          Générer un nouvel avatar
        </button>
      </div>
    </div>
  );
}
