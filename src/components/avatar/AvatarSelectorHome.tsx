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

  return (
    <div
      className={`${theme.avatarSelector.container} flex flex-col items-center gap-4`}
    >
      {avatarUrl && (
        <div className="border-4 border-black rounded-lg p-1 bg-white shadow-[4px_4px_0_0_black]">
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
        onClick={regenerateAvatar}
        className="mt-2 flex items-center gap-2 border-2 border-black bg-yellow-300 text-black font-mono px-3 py-1 rounded shadow-[3px_3px_0_0_black] hover:bg-yellow-400 transition"
      >
        <RefreshCw className="w-4 h-4" />
        {t("avatar.regenerate", "Générer un nouvel avatar")}
      </button>
    </div>
  );
}
