"use client";

import { Crown, Users } from "lucide-react";
import { adminService, PeriodKey } from "@/service/adminService";
import { Empty, ErrorBox, formatDate, Pill, Spinner, useAdminQuery } from "./adminUi";

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "day", label: "24 h" },
  { key: "week", label: "7 jours" },
  { key: "month", label: "30 jours" },
  { key: "year", label: "1 an" },
];

function StatsPanel({
  token,
  livePlayers,
  liveRooms,
  openPublic,
}: {
  token: string;
  livePlayers: number;
  liveRooms: number;
  openPublic: number;
}) {
  const { data, error } = useAdminQuery(() => adminService.stats(token), [token], 60000);
  const fmt = new Intl.NumberFormat("fr-FR");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />
            Joueurs connectés
          </p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-emerald-900">{fmt.format(livePlayers)}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Parties en cours</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-emerald-900">{fmt.format(liveRooms)}</p>
        </div>
        <div className="col-span-2 rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Salons publics ouverts</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-sky-900">{fmt.format(openPublic)}</p>
        </div>
      </div>

      {error && !data ? (
        <ErrorBox message={error} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[26rem] text-sm">
            <caption className="sr-only">Activité par période</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-2.5 text-start font-semibold">Activité</th>
                {PERIODS.map((p) => (
                  <th key={p.key} scope="col" className="px-4 py-2.5 text-end font-semibold">{p.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {([
                ["Parties créées", data?.rooms],
                ["Joueurs uniques", data?.players],
              ] as const).map(([label, values]) => (
                <tr key={label}>
                  <th scope="row" className="px-4 py-3 text-start font-medium text-slate-700">{label}</th>
                  {PERIODS.map((p) => (
                    <td key={p.key} className="px-4 py-3 text-end text-lg font-bold tabular-nums text-slate-900">
                      {values ? fmt.format(values[p.key]) : "…"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
            {data?.trackedSince
              ? `Suivi depuis le ${formatDate(data.trackedSince)} — les périodes plus longues se remplissent au fil du temps.`
              : "Le suivi démarre à la prochaine partie créée."}{" "}
            « Joueurs uniques » = appareils distincts ayant rejoint une partie.
          </p>
        </div>
      )}
    </div>
  );
}

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
  const allRooms = data ?? [];
  // An open public lobby nobody has joined yet is not a game in progress.
  const rooms = allRooms.filter((r) => !(r.isPublic && r.players.length === 0));
  const openPublic = allRooms.filter((r) => r.isPublic).length;
  const players = allRooms.reduce((n, r) => n + r.players.filter((p) => p.connected).length, 0);

  return (
    <section className="space-y-5">
      <StatsPanel token={token} livePlayers={players} liveRooms={rooms.length} openPublic={openPublic} />

      <p className="text-end text-xs text-slate-400">Actualisation automatique des parties toutes les 5 s</p>

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
                      {room.isPublic ? "Salon public" : (room.hostEmail ?? "Hôte invité (sans compte)")}
                    </p>
                  </div>
                  <span className="flex flex-wrap justify-end gap-1.5">
                    {room.isPublic && <Pill tone="blue">Publique</Pill>}
                    <Pill tone={phase.tone}>{phase.label}</Pill>
                  </span>
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
