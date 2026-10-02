"use client";

import { useEffect, useState } from "react";
import { Gift, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminService, AdminUser } from "@/service/adminService";
import {
  adminFont,
  buttonClass,
  Empty,
  ErrorBox,
  formatDate,
  inputClass,
  Pagination,
  Pill,
  Spinner,
  useAdminQuery,
} from "./adminUi";

const PROVIDERS: Record<string, string> = {
  stripe: "Stripe",
  revenuecat: "Play Store",
  manual: "Offert",
};

function SubscriptionPill({ user }: { user: AdminUser }) {
  const s = user.subscription;
  if (!s) return <Pill>Gratuit</Pill>;
  const provider = PROVIDERS[s.provider] ?? s.provider;
  if (s.effective) return <Pill tone="green">Premium · {provider}</Pill>;
  return <Pill tone="rose">{s.status === "canceled" ? "Annulé" : "Expiré"} · {provider}</Pill>;
}

export function UsersTab({ token }: { token: string }) {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(input);
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [input]);

  const { data, error, loading, reload } = useAdminQuery(
    () => adminService.users(token, search, page),
    [token, search, page]
  );
  const selected = data?.users.find((u) => u.id === selectedId) ?? null;

  return (
    <section className="space-y-4">
      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Rechercher par e-mail…"
          aria-label="Rechercher un utilisateur par e-mail"
          className={`${inputClass} ps-9`}
        />
      </div>

      {error && <ErrorBox message={error} />}
      {loading && !data ? (
        <Spinner />
      ) : data && data.users.length === 0 ? (
        <Empty>Aucun utilisateur trouvé.</Empty>
      ) : (
        data && (
          <>
            <p className="text-sm text-slate-500">
              {data.total} utilisateur{data.total > 1 ? "s" : ""} avec compte
            </p>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[40rem] text-start text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Utilisateur</th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Inscrit le</th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Abonnement</th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">Catégories</th>
                    <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <p className="max-w-[16rem] truncate font-medium text-slate-900">{u.email}</p>
                        <p className="text-xs capitalize text-slate-400">{u.signIn}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        <SubscriptionPill user={u} />
                        {u.subscription?.effective && u.subscription.currentPeriodEnd && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            jusqu’au {formatDate(u.subscription.currentPeriodEnd)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-slate-600">
                        {u.categories.length || "—"}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button
                          type="button"
                          onClick={() => setSelectedId(u.id)}
                          className={`${buttonClass.secondary} h-9 text-xs`}
                        >
                          Gérer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={data.page} total={data.total} pageSize={data.pageSize} onPage={setPage} />
          </>
        )
      )}

      <UserDialog
        user={selected}
        token={token}
        onClose={() => setSelectedId(null)}
        onChanged={reload}
      />
    </section>
  );
}

const DURATIONS = [
  { label: "30 jours", value: "30" },
  { label: "90 jours", value: "90" },
  { label: "1 an", value: "365" },
  { label: "Illimité", value: "" },
];

function UserDialog({
  user,
  token,
  onClose,
  onChanged,
}: {
  user: AdminUser | null;
  token: string;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const [days, setDays] = useState("30");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const categories = useAdminQuery(() => adminService.categories(token), [token]);

  useEffect(() => {
    setError(null);
    setConfirmRevoke(false);
    setCategory("");
  }, [user?.id]);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      await onChanged();
      setConfirmRevoke(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  const grantable = (categories.data ?? []).filter(
    (c) => c.isPremium && !user?.categories.some((uc) => uc.key === c.key)
  );
  const labelOf = (key: string) => categories.data?.find((c) => c.key === key)?.label ?? key;
  const sub = user?.subscription;

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${adminFont} max-h-[90dvh] overflow-y-auto border-slate-200 bg-white text-slate-900 sm:max-w-lg`}>
        {user && (
          <>
            <DialogHeader>
              <DialogTitle className="break-all pe-6">{user.email}</DialogTitle>
              <DialogDescription className="text-slate-500">
                Inscrit le {formatDate(user.createdAt)} · connexion {user.signIn}
              </DialogDescription>
            </DialogHeader>

            {error && <ErrorBox message={error} />}

            <section className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Abonnement Premium</h3>
                <SubscriptionPill user={user} />
              </div>
              {sub?.effective && sub.currentPeriodEnd && (
                <p className="text-xs text-slate-500">Valable jusqu’au {formatDate(sub.currentPeriodEnd)}</p>
              )}

              {sub?.effective && sub.provider !== "manual" && (
                <p className="text-xs text-slate-500">
                  Abonnement payant géré par {PROVIDERS[sub.provider] ?? sub.provider}. Pour arrêter la
                  facturation ou rembourser, passe par son tableau de bord. « Forcer l’expiration »
                  retire seulement l’accès Premium dans Blaafy (utile pour un abonnement de test).
                </p>
              )}

              {!(sub?.effective && sub.provider !== "manual") && (
                <div className="flex flex-wrap items-end gap-2">
                  <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                    Durée
                    <select
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className={`${inputClass} w-36`}
                    >
                      {DURATIONS.map((d) => (
                        <option key={d.label} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      run(() => adminService.grantSubscription(token, user.id, days ? Number(days) : null))
                    }
                    className={buttonClass.primary}
                  >
                    <Gift className="h-4 w-4" aria-hidden="true" />
                    {sub?.effective ? "Prolonger" : "Offrir Premium"}
                  </button>
                </div>
              )}

              {sub?.effective && (
                confirmRevoke ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-slate-600">
                      {sub.provider === "manual" ? "Retirer le Premium offert ?" : "Retirer le Premium maintenant ?"}
                    </span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => adminService.revokeSubscription(token, user.id))}
                      className={buttonClass.danger}
                    >
                      {sub.provider === "manual" ? "Oui, retirer" : "Oui, forcer l’expiration"}
                    </button>
                    <button type="button" onClick={() => setConfirmRevoke(false)} className={buttonClass.secondary}>
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmRevoke(true)} className={buttonClass.danger}>
                    {sub.provider === "manual" ? "Retirer l’abonnement offert" : "Forcer l’expiration"}
                  </button>
                )
              )}
            </section>

            <section className="space-y-3 rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold">Catégories débloquées à l’unité</h3>
              {user.categories.length === 0 ? (
                <p className="text-xs text-slate-500">Aucune.</p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {user.categories.map((c) => (
                    <li
                      key={c.key}
                      className="flex items-center gap-1 rounded-full bg-slate-100 py-1 ps-3 pe-1 text-xs font-medium text-slate-700"
                    >
                      {labelOf(c.key)}
                      {c.source === "granted" && <span className="text-slate-400">· offerte</span>}
                      <button
                        type="button"
                        disabled={busy}
                        aria-label={`Retirer ${labelOf(c.key)}`}
                        onClick={() => run(() => adminService.revokeCategory(token, user.id, c.key))}
                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap items-end gap-2">
                <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-slate-600">
                  Offrir une catégorie
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Choisir…</option>
                    {grantable.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  disabled={busy || !category}
                  onClick={() =>
                    run(async () => {
                      await adminService.grantCategory(token, user.id, category);
                      setCategory("");
                    })
                  }
                  className={buttonClass.secondary}
                >
                  Offrir
                </button>
              </div>
            </section>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
