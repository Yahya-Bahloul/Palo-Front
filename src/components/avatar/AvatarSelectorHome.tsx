// src/components/avatar/AvatarSelector.tsx
"use client";

import { useEffect, useState } from "react";
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (seed && typeof seed === "string" && seed.trim() !== "") {
      const url = `https://api.dicebear.com/8.x/${AVATAR_STYLE}/svg?seed=${encodeURIComponent(
        seed
      )}`;
      setAvatarUrl(url);
    } else {
      setAvatarUrl(null);
    }
  }, [seed]);

  return (
    <div className={theme.avatarSelector.container}>
      {avatarUrl && (
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
