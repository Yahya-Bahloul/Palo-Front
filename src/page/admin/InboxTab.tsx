"use client";

import { useState } from "react";
import { Check, Lightbulb, MessageCircle, HelpCircle, RotateCcw } from "lucide-react";
import {
  adminService,
  AdminFeedback,
  AdminReport,
  ReportStatus,
} from "@/service/adminService";
import {
  buttonClass,
  Empty,
  ErrorBox,
  formatDate,
  Pill,
  Spinner,
  useAdminQuery,
} from "./adminUi";

type Section = "reports" | "feedback";
type StatusFilter = ReportStatus | "";

const TYPE_META = {
  contact: { label: "Contact", icon: MessageCircle, tone: "blue" },
  feature: { label: "Fonctionnalité", icon: Lightbulb, tone: "amber" },
  question: { label: "Question proposée", icon: HelpCircle, tone: "green" },
} as const;

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: string; badge?: number }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex gap-1 rounded-lg bg-slate-200/70 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`flex h-9 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
            value === o.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {o.label}
          {!!o.badge && (
            <span className="rounded-full bg-amber-500 px-1.5 text-xs font-bold tabular-nums text-white">
              {o.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function InboxTab({
  token,
  counts,
  onChanged,
}: {
  token: string;
  counts: { reports: number; feedback: number };
  onChanged: () => void;
}) {
  const [section, setSection] = useState<Section>("reports");
  const [status, setStatus] = useState<StatusFilter>("open");

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          label="Section"
          value={section}
          onChange={setSection}
          options={[
            { id: "reports", label: "Signalements", badge: counts.reports },
            { id: "feedback", label: "Messages", badge: counts.feedback },
          ]}
        />
        <Segmented<StatusFilter>
          label="Statut"
          value={status}
          onChange={setStatus}
          options={[
            { id: "open", label: "À traiter" },
            { id: "resolved", label: "Traités" },
            { id: "", label: "Tous" },
          ]}
        />
      </div>

      {section === "reports" ? (
        <ReportsList token={token} status={status} onChanged={onChanged} />
      ) : (
        <FeedbackList token={token} status={status} onChanged={onChanged} />
      )}
    </section>
  );
}

function useRowAction(onDone: () => Promise<void> | void) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const run = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    setError(null);
    try {
      await action();
      await onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  };
  return { busyId, error, run };
}

function ReportsList({
  token,
  status,
  onChanged,
}: {
  token: string;
  status: StatusFilter;
  onChanged: () => void;
}) {
  const { data, error, loading, reload } = useAdminQuery(
    () => adminService.reports(token, status),
    [token, status]
  );
  const { busyId, error: actionError, run } = useRowAction(async () => {
    await reload();
    onChanged();
  });

  if (loading && !data) return <Spinner />;
  if (error && !data) return <ErrorBox message={error} />;
  if (!data || data.length === 0) {
    return <Empty>{status === "open" ? "Aucun signalement à traiter. 🎉" : "Aucun signalement."}</Empty>;
  }

  const toggleQuestion = (r: AdminReport) =>
    run(r.id, async () => {
      await adminService.setQuestionDisabled(token, r.questionId!, !r.questionDisabled);
      // disabling a reported question settles every open report on it
      if (!r.questionDisabled) await adminService.setReportStatus(token, r.id, "resolved");
    });

  return (
    <>
      {actionError && <ErrorBox message={actionError} />}
      <ul className="space-y-3">
        {data.map((r) => (
          <li
            key={r.id}
            className={`rounded-2xl border bg-white p-4 shadow-sm ${
              r.status === "resolved" ? "border-slate-200 opacity-70" : "border-amber-200"
            }`}
          >
            <p className="break-words text-sm font-semibold text-slate-900">{r.questionText}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {r.category && <Pill>{r.category}</Pill>}
              {r.lang && <Pill>{r.lang.toUpperCase()}</Pill>}
              {r.questionDisabled && <Pill tone="rose">Question désactivée</Pill>}
              {r.openReportsForQuestion > 1 && (
                <Pill tone="amber">{r.openReportsForQuestion} signalements ouverts</Pill>
              )}
              {r.status === "resolved" && <Pill tone="green">Traité</Pill>}
            </div>

            {r.comment ? (
              <blockquote className="mt-3 break-words rounded-lg border-s-4 border-amber-300 bg-amber-50 px-3 py-2 text-sm text-slate-700">
                {r.comment}
              </blockquote>
            ) : (
              <p className="mt-3 text-xs italic text-slate-400">Sans commentaire</p>
            )}

            <p className="mt-2 text-xs text-slate-400">
              {formatDate(r.createdAt)} · {r.reporterEmail ?? "joueur invité"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {r.questionId && r.questionDisabled !== null && (
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => toggleQuestion(r)}
                  className={r.questionDisabled ? buttonClass.secondary : buttonClass.danger}
                >
                  {r.questionDisabled ? "Réactiver la question" : "Désactiver la question"}
                </button>
              )}
              {r.questionId && r.questionDisabled === null && (
                <span className="self-center text-xs text-slate-400">Question introuvable (supprimée ?)</span>
              )}
              <StatusButton
                resolved={r.status === "resolved"}
                busy={busyId === r.id}
                onClick={() =>
                  run(r.id, () =>
                    adminService.setReportStatus(token, r.id, r.status === "resolved" ? "open" : "resolved")
                  )
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function FeedbackList({
  token,
  status,
  onChanged,
}: {
  token: string;
  status: StatusFilter;
  onChanged: () => void;
}) {
  const { data, error, loading, reload } = useAdminQuery(
    () => adminService.feedback(token, status),
    [token, status]
  );
  const { busyId, error: actionError, run } = useRowAction(async () => {
    await reload();
    onChanged();
  });

  if (loading && !data) return <Spinner />;
  if (error && !data) return <ErrorBox message={error} />;
  if (!data || data.length === 0) {
    return <Empty>{status === "open" ? "Aucun message à traiter. 🎉" : "Aucun message."}</Empty>;
  }

  return (
    <>
      {actionError && <ErrorBox message={actionError} />}
      <ul className="space-y-3">
        {data.map((f: AdminFeedback) => {
          const meta = TYPE_META[f.type];
          const Icon = meta.icon;
          return (
            <li
              key={f.id}
              className={`rounded-2xl border bg-white p-4 shadow-sm ${
                f.status === "resolved" ? "border-slate-200 opacity-70" : "border-amber-200"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone={meta.tone}>
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  {meta.label}
                </Pill>
                {f.lang && <Pill>{f.lang.toUpperCase()}</Pill>}
                {f.status === "resolved" && <Pill tone="green">Traité</Pill>}
                <span className="ms-auto text-xs text-slate-400">{formatDate(f.createdAt)}</span>
              </div>

              <p className="mt-3 whitespace-pre-wrap break-words text-sm text-slate-800">{f.message}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {f.email ? (
                  <a
                    href={`mailto:${f.email}`}
                    className="break-all text-sm font-medium text-amber-700 underline underline-offset-2"
                  >
                    {f.email}
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Pas d’e-mail laissé</span>
                )}
                <span className="ms-auto">
                  <StatusButton
                    resolved={f.status === "resolved"}
                    busy={busyId === f.id}
                    onClick={() =>
                      run(f.id, () =>
                        adminService.setFeedbackStatus(token, f.id, f.status === "resolved" ? "open" : "resolved")
                      )
                    }
                  />
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function StatusButton({
  resolved,
  busy,
  onClick,
}: {
  resolved: boolean;
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" disabled={busy} onClick={onClick} className={buttonClass.secondary}>
      {resolved ? (
        <>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Rouvrir
        </>
      ) : (
        <>
          <Check className="h-4 w-4" aria-hidden="true" /> Marquer traité
        </>
      )}
    </button>
  );
}
