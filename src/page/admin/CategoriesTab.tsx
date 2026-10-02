"use client";

import { useState } from "react";
import { Gift, Shuffle } from "lucide-react";
import { adminService } from "@/service/adminService";
import {
  Empty,
  ErrorBox,
  Pill,
  Spinner,
  Switch,
  inputClass,
  buttonClass,
  formatDate,
  useAdminQuery,
} from "./adminUi";

export function CategoriesTab({
  token,
  onOpenQuestions,
}: {
  token: string;
  onOpenQuestions: (categoryKey: string) => void;
}) {
  const { data, error, loading, reload } = useAdminQuery(
    () => adminService.categories(token),
    [token]
  );
  const [search, setSearch] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);

  if (loading && !data) return <Spinner />;
  if (error && !data) return <ErrorBox message={error} />;

  const q = search.trim().toLowerCase();
  const categories = (data ?? []).filter(
    (c) => !q || c.label.toLowerCase().includes(q) || c.key.includes(q)
  );
  const disabledCount = (data ?? []).filter((c) => c.disabled).length;
  const all = data ?? [];
  const premiumCount = all.filter((c) => c.isPremium).length;
  const weeklyCount = all.filter((c) => c.freeUntil).length;

  const run = async (key: string | null, action: () => Promise<unknown>) => {
    setBusyKey(key);
    setActionError(null);
    try {
      await action();
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusyKey(null);
    }
  };

  const pickRandom = async () => {
    setPicking(true);
    await run(null, () => adminService.randomWeeklyFree(token, 3));
    setPicking(false);
  };

  const toggle = async (key: string, enabled: boolean) => {
    setBusyKey(key);
    setActionError(null);
    try {
      await adminService.setCategoryDisabled(token, key, !enabled);
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une catégorie…"
          aria-label="Rechercher une catégorie"
          className={`${inputClass} max-w-xs`}
        />
        <p className="text-sm text-slate-500">
          {(data ?? []).length - disabledCount} active{(data ?? []).length - disabledCount > 1 ? "s" : ""}
          {disabledCount > 0 && <> · {disabledCount} désactivée{disabledCount > 1 ? "s" : ""}</>}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Gift className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 basis-56">
          <p className="text-sm font-semibold text-amber-900">Catégories gratuites de la semaine</p>
          <p className="text-xs text-amber-800">
            {weeklyCount} sur {premiumCount} catégories premium gratuites pour tout le monde. Chaque
            sélection dure 7 jours.
          </p>
        </div>
        <button
          type="button"
          onClick={pickRandom}
          disabled={picking}
          className={buttonClass.primary}
        >
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          {picking ? "Tirage…" : "Tirer 3 au hasard"}
        </button>
      </div>

      {actionError && <ErrorBox message={actionError} />}

      {categories.length === 0 ? (
        <Empty>Aucune catégorie ne correspond.</Empty>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li
              key={c.key}
              className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-opacity ${
                c.disabled ? "border-slate-200 opacity-70" : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{c.label}</p>
                  <p className="truncate font-mono text-xs text-slate-400">{c.key}</p>
                </div>
                <Switch
                  checked={!c.disabled}
                  disabled={busyKey === c.key}
                  label={`${c.disabled ? "Activer" : "Désactiver"} la catégorie ${c.label}`}
                  onChange={(enabled) => toggle(c.key, enabled)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {c.isPremium ? <Pill tone="amber">Premium</Pill> : <Pill tone="green">Gratuite</Pill>}
                {c.freeUntil && (
                  <Pill tone="blue">
                    <Gift className="h-3 w-3" aria-hidden="true" />
                    Gratuite jusqu’au {formatDate(c.freeUntil)}
                  </Pill>
                )}
                {c.disabled && <Pill tone="rose">Désactivée</Pill>}
                <span className="text-xs tabular-nums text-slate-500">
                  {c.questionCount} question{c.questionCount > 1 ? "s" : ""}
                  {c.disabledQuestionCount > 0 && ` · ${c.disabledQuestionCount} off`}
                </span>
              </div>
              {c.isPremium && (
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                  Gratuite cette semaine
                  <Switch
                    checked={!!c.freeUntil}
                    disabled={busyKey === c.key}
                    label={`Gratuite cette semaine : ${c.label}`}
                    onChange={(enabled) =>
                      run(c.key, () => adminService.setWeeklyFree(token, c.key, enabled))
                    }
                  />
                </label>
              )}
              <button
                type="button"
                onClick={() => onOpenQuestions(c.key)}
                className={`${buttonClass.secondary} h-9 text-xs`}
              >
                Voir les questions
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
