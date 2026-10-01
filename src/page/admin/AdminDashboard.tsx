"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Inbox, Layers, ListChecks, LogIn, ShieldAlert, Swords, Users } from "lucide-react";
import { useAuthStore } from "@/utils/useAuthStore";
import { adminService, AdminApiError } from "@/service/adminService";
import { adminFont, buttonClass, Spinner, useAdminQuery } from "./adminUi";
import { RoomsTab } from "./RoomsTab";
import { UsersTab } from "./UsersTab";
import { CategoriesTab } from "./CategoriesTab";
import { QuestionsTab } from "./QuestionsTab";
import { InboxTab } from "./InboxTab";

const TABS = [
  { id: "rooms", label: "Parties", icon: Swords },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "categories", label: "Catégories", icon: Layers },
  { id: "questions", label: "Questions", icon: ListChecks },
  { id: "inbox", label: "Retours", icon: Inbox },
] as const;

type TabId = (typeof TABS)[number]["id"];
type Gate = "checking" | "ok" | "denied" | "error";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-dvh bg-slate-50 ${adminFont} text-slate-900 [padding-bottom:env(safe-area-inset-bottom,0px)] [padding-top:env(safe-area-inset-top,0px)]`}>
      {children}
    </div>
  );
}

function Notice({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Shell>
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          {icon}
        </span>
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="space-y-4 text-sm text-slate-600">{children}</div>
      </main>
    </Shell>
  );
}

export function AdminDashboard() {
  const { user, accessToken, logout } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [gate, setGate] = useState<Gate>("checking");
  const [tab, setTab] = useState<TabId>("rooms");
  const [questionCategory, setQuestionCategory] = useState("");
  const inbox = useAdminQuery(
    () => (accessToken && gate === "ok" ? adminService.inbox(accessToken) : Promise.resolve(null)),
    [accessToken, gate],
    60000
  );
  const openCount = (inbox.data?.reports ?? 0) + (inbox.data?.feedback ?? 0);

  // The auth store reads localStorage on first render; wait one tick so we
  // don't flash "login required" for an already signed-in admin.
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    setGate("checking");
    adminService
      .me(accessToken)
      .then(() => !cancelled && setGate("ok"))
      .catch((e: unknown) => {
        if (cancelled) return;
        const status = e instanceof AdminApiError ? e.status : 0;
        setGate(status === 401 || status === 403 ? "denied" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  if (!hydrated) return <Shell><Spinner /></Shell>;

  if (!accessToken) {
    return (
      <Notice icon={<LogIn className="h-6 w-6" />} title="Connexion requise">
        <p>Connecte-toi avec un compte administrateur pour accéder au tableau de bord.</p>
        <Link href="/login" className={buttonClass.primary}>Se connecter</Link>
      </Notice>
    );
  }
  if (gate === "checking") return <Shell><Spinner label="Vérification des droits…" /></Shell>;
  if (gate === "denied") {
    return (
      <Notice icon={<ShieldAlert className="h-6 w-6" />} title="Accès refusé">
        <p>
          Le compte <strong className="break-all">{user?.email}</strong> n’est pas administrateur.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={logout} className={buttonClass.secondary}>
            Changer de compte
          </button>
          <Link href="/" className={buttonClass.secondary}>Retour au jeu</Link>
        </div>
      </Notice>
    );
  }
  if (gate === "error") {
    return (
      <Notice icon={<ShieldAlert className="h-6 w-6" />} title="Serveur injoignable">
        <p>Impossible de vérifier tes droits pour le moment. Réessaie dans un instant.</p>
        <button type="button" onClick={() => location.reload()} className={buttonClass.primary}>
          Réessayer
        </button>
      </Notice>
    );
  }

  const openQuestions = (categoryKey: string) => {
    setQuestionCategory(categoryKey);
    setTab("questions");
  };

  return (
    <Shell>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              aria-label="Retour au jeu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
            </Link>
            <h1 className="truncate text-lg font-bold">Blaafy · Admin</h1>
          </div>
          <span className="hidden max-w-[14rem] truncate text-xs text-slate-500 sm:block">{user?.email}</span>
        </div>
        <nav aria-label="Sections" className="mx-auto max-w-5xl overflow-x-auto px-4">
          <div role="tablist" className="flex gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                onClick={() => setTab(id)}
                className={`flex h-11 shrink-0 cursor-pointer items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500 ${
                  tab === id
                    ? "border-amber-500 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
                {id === "inbox" && openCount > 0 && (
                  <span className="rounded-full bg-amber-500 px-1.5 text-xs font-bold tabular-nums text-white">
                    {openCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="mx-auto max-w-5xl px-4 py-6"
      >
        {tab === "rooms" && <RoomsTab token={accessToken} />}
        {tab === "users" && <UsersTab token={accessToken} />}
        {tab === "categories" && <CategoriesTab token={accessToken} onOpenQuestions={openQuestions} />}
        {tab === "inbox" && (
          <InboxTab
            token={accessToken}
            counts={inbox.data ?? { reports: 0, feedback: 0 }}
            onChanged={inbox.reload}
          />
        )}
        {tab === "questions" && (
          <QuestionsTab key={questionCategory} token={accessToken} initialCategory={questionCategory} />
        )}
      </main>
    </Shell>
  );
}
