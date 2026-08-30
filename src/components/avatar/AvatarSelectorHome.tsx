// src/components/avatar/AvatarSelector.tsx
"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  useEffect(() => {
    if (seed?.trim()) {
      const url = `https://api.dicebear.com/8.x/${AVATAR_STYLE}/svg?seed=${encodeURIComponent(
        seed
      )}`;
      setAvatarUrl(url);
    } else {
      setAvatarUrl(null);
    }
  }, [seed]);

  // The regenerate control sits on the avatar instead of on its own row, so it
  // adds no height. Icon-only, so it carries its label through aria-label.
  return (
    <div className={theme.avatarSelector.container}>
      <div className="relative w-24 h-24 mx-auto">
        {avatarUrl && (
          <div className={theme.avatarSelector.imageWrapper}>
            <Image
              src={avatarUrl}
              alt={t("avatar.previewAlt", "Aperçu de l’avatar")}
              width={96}
              height={96}
              unoptimized
            />
          </div>
        )}

        <button
          type="button"
          onClick={regenerateAvatar}
          aria-label={t("avatar.regenerate", "Générer un nouvel avatar")}
          title={t("avatar.regenerate", "Générer un nouvel avatar")}
          className={theme.avatarSelector.button}
        >
          <RefreshCw className={theme.avatarSelector.icon} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
