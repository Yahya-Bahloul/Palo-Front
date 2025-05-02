// src/components/avatar/PlayerAvatar.tsx
"use client";

import Image from "next/image";
import { User } from "lucide-react";

type Props = {
  name: string;
  size?: number;
  style?: string; // ex: "bottts", "adventurer", etc.
};

export function PlayerAvatar({ name, size = 40, style = "adventurer" }: Props) {
  const url = `https://api.dicebear.com/8.x/${style}/svg?seed=${encodeURIComponent(
    name
  )}`;

  return (
    <div
      className="rounded-full overflow-hidden bg-amber-100 border border-amber-300 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Image
        src={url}
        alt={`Avatar de ${name}`}
        width={size}
        height={size}
        unoptimized
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <User className="w-5 h-5 text-amber-600" />
    </div>
  );
}
