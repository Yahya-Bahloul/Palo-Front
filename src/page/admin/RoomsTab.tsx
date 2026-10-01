"use client";

import { Crown, Users } from "lucide-react";
import { adminService } from "@/service/adminService";
import { Empty, ErrorBox, Pill, Spinner, useAdminQuery } from "./adminUi";

const PHASES: Record<string, { label: string; tone: "slate" | "blue" | "amber" | "green" }> = {
  starting: { label: "Lobby", tone: "slate" },
  categories: { label: "Choix de catégorie", tone: "blue" },
  guessing: { label: "Réponses", tone: "amber" },
  voting: { label: "Votes", tone: "amber" },
  results: { label: "Résultats", tone: "green" },
  "final.results": { label: "Classement final", tone: "green" },
};

export function RoomsTab({ token }: { token: string }) {
  const { data, error, loading } = useAdminQuery(() => adminService.rooms(token), [token], 5000);

  if (loading && !data) return <Spinner />;
  if (error && !data) return <ErrorBox message={error} />;
  const rooms = data ?? [];
  const players = rooms.reduce((n, r) => n + r.players.filter((p) => p.connected).length, 0);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">
          <strong className="text-slate-900">{rooms.length}</strong> partie
          {rooms.length > 1 ? "s" : ""} en cours ·{" "}
          <strong className="text-slate-900">{players}</strong> joueur{players > 1 ? "s" : ""}{" "}
          connecté{players > 1 ? "s" : ""}
        </p>
        <span className="text-xs text-slate-400">Actualisation automatique toutes les 5 s</span>
      </div>

      {rooms.length === 0 ? (
        <Empty>Aucune partie en cours pour le moment.</Empty>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {rooms.map((room) => {
            const phase = PHASES[room.phase] ?? { label: room.phase, tone: "slate" as const };
            return (
              <li key={room.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-base font-bold tracking-wider text-slate-900">
                      {room.id}
                    </p>
                    <p className="text-xs text-slate-500">
                      {room.hostEmail ?? "Hôte invité (sans compte)"}
                    </p>
                  </div>
                  <Pill tone={phase.tone}>{phase.label}</Pill>
                </div>

                <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
                  <div className="flex gap-1.5">
                    <dt className="text-slate-400">Manche</dt>
                    <dd className="font-semibold tabular-nums text-slate-800">
                      {room.currentRound}/{room.maxRound}
                    </dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-slate-400">Langue</dt>
                    <dd className="font-semibold uppercase text-slate-800">{room.lang}</dd>
                  </div>
                  {room.currentCategory && (
                    <div className="flex gap-1.5">
                      <dt className="text-slate-400">Catégorie</dt>
                      <dd className="font-semibold text-slate-800">{room.currentCategory}</dd>
                    </div>
                  )}
                </dl>

                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Joueurs">
                  {[...room.players]
                    .sort((a, b) => b.score - a.score)
                    .map((p, i) => (
                      <li
                        key={`${p.name}-${i}`}
                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                          p.connected
                            ? "border-slate-200 bg-slate-50 text-slate-700"
                            : "border-slate-200 bg-white text-slate-400"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-2 w-2 rounded-full ${p.connected ? "bg-emerald-500" : "bg-slate-300"}`}
                        />
                        <span className="sr-only">{p.connected ? "Connecté" : "Déconnecté"}</span>
                        {p.isHost && <Crown className="h-3 w-3 text-amber-500" aria-label="Hôte" />}
                        <span className="max-w-[8rem] truncate font-medium">{p.name}</span>
                        <span className="tabular-nums text-slate-400">{p.score}</span>
                        {p.joinedLate && <span className="text-slate-400">· tardif</span>}
                      </li>
                    ))}
                  {room.players.length === 0 && (
                    <li className="flex items-center gap-1 text-xs text-slate-400">
                      <Users className="h-3.5 w-3.5" aria-hidden="true" /> Salle vide
                    </li>
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
