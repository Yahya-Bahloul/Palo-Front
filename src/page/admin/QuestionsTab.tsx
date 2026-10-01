"use client";

import { useEffect, useState } from "react";
import { Pencil, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  adminService,
  AdminQuestion,
  QuestionTranslation,
} from "@/service/adminService";
import {
  adminFont,
  buttonClass,
  Empty,
  ErrorBox,
  inputClass,
  Pagination,
  Pill,
  Spinner,
  Switch,
  useAdminQuery,
} from "./adminUi";

const LANGS = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
] as const;

const headline = (q: AdminQuestion) => {
  const t = q.translations.fr ?? q.translations.en ?? Object.values(q.translations)[0];
  return t ?? { question: "(sans texte)", correct: "", wrongAnswers: [] };
};

export function QuestionsTab({
  token,
  initialCategory,
}: {
  token: string;
  initialCategory: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState<"" | "enabled" | "disabled">("");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(input);
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [input]);

  const categories = useAdminQuery(() => adminService.categories(token), [token]);
  const { data, error, loading, reload } = useAdminQuery(
    () => adminService.questions(token, { category, search, status, page }),
    [token, category, search, status, page]
  );
  const editing = data?.questions.find((q) => q.id === editingId) ?? null;

  const toggle = async (q: AdminQuestion, enabled: boolean) => {
    setBusyId(q.id);
    setActionError(null);
    try {
      await adminService.setQuestionDisabled(token, q.id, !enabled);
      await reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          aria-label="Filtrer par catégorie"
          className={`${inputClass} w-full sm:w-52`}
        >
          <option value="">Toutes les catégories</option>
          {(categories.data ?? []).map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as typeof status);
            setPage(1);
          }}
          aria-label="Filtrer par statut"
          className={`${inputClass} w-full sm:w-44`}
        >
          <option value="">Tous les statuts</option>
          <option value="enabled">Actives</option>
          <option value="disabled">Désactivées</option>
        </select>
        <div className="relative min-w-0 flex-1 basis-56">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chercher dans les questions et réponses…"
            aria-label="Rechercher une question"
            className={`${inputClass} ps-9`}
          />
        </div>
      </div>

      {(error || actionError) && <ErrorBox message={(error ?? actionError)!} />}

      {loading && !data ? (
        <Spinner />
      ) : data && data.questions.length === 0 ? (
        <Empty>Aucune question ne correspond à ces filtres.</Empty>
      ) : (
        data && (
          <>
            <p className="text-sm text-slate-500">
              {data.total} question{data.total > 1 ? "s" : ""}
            </p>
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {data.questions.map((q) => {
                const t = headline(q);
                return (
                  <li
                    key={q.id}
                    className={`flex items-start gap-3 p-4 ${q.disabled ? "bg-slate-50" : ""}`}
                  >
                    {q.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={q.imageUrl}
                        alt=""
                        loading="lazy"
                        className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 object-cover"
                      />
                    )}
                    <div className={`min-w-0 flex-1 ${q.disabled ? "opacity-60" : ""}`}>
                      <p className="break-words text-sm font-medium text-slate-900">{t.question}</p>
                      <p className="mt-0.5 break-words text-xs text-emerald-700">✓ {t.correct}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Pill>{q.category}</Pill>
                        {q.disabled && <Pill tone="rose">Désactivée</Pill>}
                        {Object.keys(q.translations).length < 3 && (
                          <Pill tone="amber">
                            {Object.keys(q.translations).length}/3 langues
                          </Pill>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(q.id)}
                        aria-label="Modifier la question"
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <Switch
                        checked={!q.disabled}
                        disabled={busyId === q.id}
                        label={`${q.disabled ? "Activer" : "Désactiver"} la question`}
                        onChange={(enabled) => toggle(q, enabled)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <Pagination page={data.page} total={data.total} pageSize={data.pageSize} onPage={setPage} />
          </>
        )
      )}

      <EditDialog
        question={editing}
        token={token}
        categories={categories.data ?? []}
        onClose={() => setEditingId(null)}
        onSaved={async () => {
          setEditingId(null);
          await reload();
        }}
      />
    </section>
  );
}

type Draft = Record<string, { question: string; correct: string; w: [string, string, string] }>;

const toDraft = (q: AdminQuestion): Draft =>
  Object.fromEntries(
    LANGS.map(({ code }) => {
      const t = q.translations[code];
      return [
        code,
        {
          question: t?.question ?? "",
          correct: t?.correct ?? "",
          w: [t?.wrongAnswers[0] ?? "", t?.wrongAnswers[1] ?? "", t?.wrongAnswers[2] ?? ""],
        },
      ];
    })
  );

function EditDialog({
  question,
  token,
  categories,
  onClose,
  onSaved,
}: {
  question: AdminQuestion | null;
  token: string;
  categories: { key: string; label: string }[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [lang, setLang] = useState<string>("fr");
  const [draft, setDraft] = useState<Draft>({});
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!question) return;
    setDraft(toDraft(question));
    setCategory(question.category);
    setLang("fr");
    setError(null);
  }, [question]);

  const d = draft[lang];
  const patch = (fn: (x: Draft[string]) => Draft[string]) =>
    setDraft((cur) => ({ ...cur, [lang]: fn(cur[lang]) }));

  const save = async () => {
    if (!question) return;
    const translations: Record<string, QuestionTranslation> = {};
    for (const { code, label } of LANGS) {
      const x = draft[code];
      const filled = [x.question, x.correct, ...x.w].filter((v) => v.trim()).length;
      if (filled === 0 && !question.translations[code]) continue; // untouched, absent language
      if (filled < 5) {
        setLang(code);
        setError(`${label} : les 5 champs (question, bonne réponse, 3 fausses) sont obligatoires.`);
        return;
      }
      translations[code] = {
        question: x.question.trim(),
        correct: x.correct.trim(),
        wrongAnswers: x.w.map((v) => v.trim()),
      };
    }
    setSaving(true);
    setError(null);
    try {
      await adminService.updateQuestion(token, question.id, {
        category: category !== question.category ? category : undefined,
        translations,
      });
      await onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const field = "flex flex-col gap-1 text-xs font-medium text-slate-600";

  return (
    <Dialog open={!!question} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${adminFont} max-h-[90dvh] overflow-y-auto border-slate-200 bg-white text-slate-900 sm:max-w-xl`}>
        <DialogHeader>
          <DialogTitle>Modifier la question</DialogTitle>
          <DialogDescription className="text-slate-500">
            Les changements sont appliqués tout de suite en jeu.
          </DialogDescription>
        </DialogHeader>

        {question && d && (
          <div className="space-y-4">
            <label className={field}>
              Catégorie
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </label>

            <div role="tablist" aria-label="Langue" className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  role="tab"
                  aria-selected={lang === code}
                  onClick={() => setLang(code)}
                  className={`h-9 flex-1 cursor-pointer rounded-md text-sm font-semibold transition ${
                    lang === code ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-3" dir={lang === "ar" ? "rtl" : "ltr"}>
              <label className={field}>
                Question
                <textarea
                  rows={3}
                  value={d.question}
                  onChange={(e) => patch((x) => ({ ...x, question: e.target.value }))}
                  className={`${inputClass} h-auto py-2`}
                />
              </label>
              <label className={field}>
                Bonne réponse
                <input
                  value={d.correct}
                  onChange={(e) => patch((x) => ({ ...x, correct: e.target.value }))}
                  className={`${inputClass} border-emerald-300`}
                />
              </label>
              {[0, 1, 2].map((i) => (
                <label key={i} className={field}>
                  Fausse réponse {i + 1}
                  <input
                    value={d.w[i]}
                    onChange={(e) =>
                      patch((x) => {
                        const w = [...x.w] as Draft[string]["w"];
                        w[i] = e.target.value;
                        return { ...x, w };
                      })
                    }
                    className={inputClass}
                  />
                </label>
              ))}
            </div>

            {error && <ErrorBox message={error} />}

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={onClose} className={buttonClass.secondary}>
                Annuler
              </button>
              <button type="button" onClick={save} disabled={saving} className={buttonClass.primary}>
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
