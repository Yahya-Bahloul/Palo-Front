import { X } from "lucide-react";

type Props = {
  message: string;
  onDismiss: () => void;
};

export function NoticeToast({ message, onDismiss }: Props) {
  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-sm rounded-xl bg-black/85 text-yellow-300 text-sm text-center py-3 pl-4 pr-9 shadow-lg animate-in fade-in zoom-in-95 duration-200"
      >
        {message}
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute top-2 right-2 text-yellow-300/70 hover:text-yellow-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
