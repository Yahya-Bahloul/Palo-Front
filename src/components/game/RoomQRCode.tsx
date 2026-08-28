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

  return (
    <div className="flex flex-col items-center gap-3 p-5">
      <div className="p-3 bg-white rounded-xl shadow-inner">
        <QRCodeSVG
          value={joinUrl}
          size={150}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
        />
      </div>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95 transition-all"
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
