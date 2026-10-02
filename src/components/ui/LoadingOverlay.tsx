"use client";

type Props = {
  /** What is happening, e.g. "Création de la salle…". */
  message: string;
};

/**
 * Full-screen "please wait" layer shown while the app is busy (redirecting to
 * Stripe, creating or joining a room). It sits above the page, so nothing
 * underneath can be tapped a second time while the first action is running.
 */
export function LoadingOverlay({ message }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-6 backdrop-blur-sm"
    >
      <div className="neon-card flex w-full max-w-xs flex-col items-center gap-5 !rounded-[var(--skin-radius)] p-8 text-center">
        <span className="relative block h-14 w-14" aria-hidden="true">
          <span className="absolute inset-0 rounded-full border-4 border-[color:var(--skin-border)]" />
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[color:var(--skin-primary)] motion-reduce:animate-pulse" />
        </span>
        <p className="font-arcade text-sm text-[color:var(--skin-text)]">{message}</p>
      </div>
    </div>
  );
}
