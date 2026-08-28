"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogIn, LogOut, Crown } from "lucide-react";
import { useAuthStore } from "@/utils/useAuthStore";

export function HomeMenu() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const item =
    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-arcade text-sm text-[color:var(--skin-text)] hover:bg-[color:var(--skin-primary)]/15 transition cursor-pointer";

  return (
    <div
      className="absolute left-4 z-50"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t("menu", "Menu")}
          className="skin-stepper"
        >
          <Menu className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="w-56 p-2 neon-card !rounded-[calc(var(--skin-radius)*0.75)]"
        >
          <DropdownMenuItem
            className={item}
            onClick={() => router.push("/purchases")}
          >
            <Crown className="h-4 w-4 shrink-0 text-[color:var(--skin-primary)]" />
            {t("getPremium", "Passer Premium")}
          </DropdownMenuItem>

          {user ? (
            <>
              <div className="h-px my-1 bg-[color:var(--skin-border)]" />
              <div className="px-3 pt-1 pb-2 text-xs font-arcade text-[color:var(--skin-muted)] truncate">
                {user.email}
              </div>
              <DropdownMenuItem
                className={`${item} text-[color:var(--skin-danger)] hover:bg-[color:var(--skin-danger)]/15`}
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {t("auth.logout", "Se déconnecter")}
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              className={item}
              onClick={() => router.push("/login")}
            >
              <LogIn className="h-4 w-4 shrink-0" />
              {t("auth.login", "Se connecter")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
