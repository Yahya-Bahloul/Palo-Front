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
      setJoinUrl(`${window.location.origin}/room/${roomId}`);
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
    <div className="flex flex-col items-center gap-4 p-6 ">
      <QRCodeSVG
        value={joinUrl}
        size={160}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
        className="rounded-xl shadow-md"
      />
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-lg font-semibold text-center">
          {t("room.qrCode.title")}
        </h2>
        <button
          onClick={handleCopy}
          className="p-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition"
          title={t("room.qrCode.copy")}
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
