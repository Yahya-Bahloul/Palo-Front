"use client";

import { useState } from "react";
import { adminService } from "@/service/adminService";
import {
  Empty,
  ErrorBox,
  Pill,
  Spinner,
  Switch,
  inputClass,
  buttonClass,
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

  if (loading && !data) return <Spinner />;
  if (error && !data) return <ErrorBox message={error} />;

  const q = search.trim().toLowerCase();
  const categories = (data ?? []).filter(
    (c) => !q || c.label.toLowerCase().includes(q) || c.key.includes(q)
  );
  const disabledCount = (data ?? []).filter((c) => c.disabled).length;

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
                {c.disabled && <Pill tone="rose">Désactivée</Pill>}
                <span className="text-xs tabular-nums text-slate-500">
                  {c.questionCount} question{c.questionCount > 1 ? "s" : ""}
                  {c.disabledQuestionCount > 0 && ` · ${c.disabledQuestionCount} off`}
                </span>
              </div>
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
