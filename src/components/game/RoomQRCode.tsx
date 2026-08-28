// src/components/game/RoomQrCode.tsx
"use client";

import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

type Props = {
  roomId: string;
};

export function RoomQRCode({ roomId }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");

  // Assure que joinUrl est défini uniquement côté client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setJoinUrl(`${window.location.origin}/room?roomId=${roomId}`);
    }
  }, [roomId]);

  const handleCopy = () => {
    if (!joinUrl) return;
    navigator.clipboard.writeText(joinUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!joinUrl) return null; // ou <Skeleton /> si tu veux afficher un loader temporaire

  const code = roomId?.toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="skin-panel p-3 bg-white">
        <QRCodeSVG
          value={joinUrl}
          size={140}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
        />
      </div>

      {code && (
        <div className="flex items-center gap-2">
          <span className="font-arcade text-xs uppercase tracking-wide text-[color:var(--skin-muted)]">
            {t("roomCode")}
          </span>
          <span className="skin-readout px-3 py-1 text-base tracking-[0.3em] font-bold">
            {code}
          </span>
        </div>
      )}

      <button
        onClick={handleCopy}
        className="skin-chip px-4 py-2 text-sm inline-flex items-center gap-2"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            {t("room.qrCode.copied")}
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            {t("room.qrCode.copy")}
          </>
        )}
      </button>
    </div>
  );
}
