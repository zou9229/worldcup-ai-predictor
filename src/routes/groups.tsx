import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, CalendarDays, ListOrdered, Trophy } from 'lucide-react';

import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { Badge } from '@/components/ui/badge';
import { TeamFlagMark } from '@/components/worldcup/team-flag';
import { Link } from '@/core/i18n/navigation';
import { buildSeoLinks, buildSeoMeta } from '@/lib/seo';
import { getDisplayScore, type WorldCupMatch } from '@/lib/worldcup';
import { getWorldCupMatchesFn } from '@/lib/worldcup-server';
import { getLocale } from '@/paraglide/runtime.js';

type TeamStanding = {
  team: string;
  played: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  projectedPoints: number;
  projectedGoalsFor: number;
  projectedGoalsAgainst: number;
};

type GroupSection = {
  name: string;
  matches: WorldCupMatch[];
  standings: TeamStanding[];
};

function emptyStanding(team: string): TeamStanding {
  return {
    team,
    played: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    projectedPoints: 0,
    projectedGoalsFor: 0,
    projectedGoalsAgainst: 0,
  };
}

function parseScore(value: string): [number, number] | null {
  const match = /^(\d+)-(\d+)$/.exec(value);
  if (!match) return null;
  return [Number(match[1]), Number(match[2])];
}

function addResult(
  home: TeamStanding,
  away: TeamStanding,
  score: [number, number],
  mode: 'actual' | 'projected'
) {
  const [homeGoals, awayGoals] = score;
  if (mode === 'actual') {
    home.played += 1;
    away.played += 1;
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;
  }

  home.projectedGoalsFor += homeGoals;
  home.projectedGoalsAgainst += awayGoals;
  away.projectedGoalsFor += awayGoals;
  away.projectedGoalsAgainst += homeGoals;

  const homePoints = homeGoals === awayGoals ? 1 : homeGoals > awayGoals ? 3 : 0;
  const awayPoints = homeGoals === awayGoals ? 1 : awayGoals > homeGoals ? 3 : 0;

  if (mode === 'actual') {
    home.points += homePoints;
    away.points += awayPoints;
  }

  home.projectedPoints += homePoints;
  away.projectedPoints += awayPoints;
}

function sortStandings(a: TeamStanding, b: TeamStanding) {
  const gdA = a.projectedGoalsFor - a.projectedGoalsAgainst;
  const gdB = b.projectedGoalsFor - b.projectedGoalsAgainst;
  const actualGdA = a.goalsFor - a.goalsAgainst;
  const actualGdB = b.goalsFor - b.goalsAgainst;

  return (
    b.projectedPoints - a.projectedPoints ||
    gdB - gdA ||
    b.points - a.points ||
    actualGdB - actualGdA ||
    b.projectedGoalsFor - a.projectedGoalsFor ||
    a.team.localeCompare(b.team)
  );
}

function buildGroups(matches: WorldCupMatch[]): GroupSection[] {
  const groups = new Map<string, WorldCupMatch[]>();

  for (const match of matches) {
    if (!match.group) continue;
    const group = groups.get(match.group) ?? [];
    group.push(match);
    groups.set(match.group, group);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, groupMatches]) => {
      const standings = new Map<string, TeamStanding>();
      const ensure = (team: string) => {
        const current = standings.get(team) ?? emptyStanding(team);
        standings.set(team, current);
        return current;
      };

      for (const match of groupMatches) {
        const home = ensure(match.teamA);
        const away = ensure(match.teamB);

        if (match.score?.ft) {
          addResult(home, away, match.score.ft, 'actual');
        } else {
          const projected = parseScore(match.prediction.predictedScore);
          if (projected) addResult(home, away, projected, 'projected');
        }
      }

      return {
        name,
        matches: [...groupMatches].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)),
        standings: Array.from(standings.values()).sort(sortStandings),
      };
    });
}

function GroupsPage() {
  const { matches, syncStatus } = Route.useLoaderData();
  const groups = buildGroups(matches);
  const groupStageMatches = groups.reduce((count, group) => count + group.matches.length, 0);

  return (
    <div className="min-h-screen bg-[#edf4ed] text-slate-950">
      <Header />
      <main>
        <section className="border-b border-emerald-950/10 bg-[#07130f] px-4 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-lime-200/20 bg-lime-200/12 text-lime-100" variant="outline">
                World Cup groups
              </Badge>
              <Badge className="border-white/15 bg-white/8 text-white/70" variant="outline">
                {groups.length} groups
              </Badge>
              <Badge className="border-white/15 bg-white/8 text-white/70" variant="outline">
                {syncStatus.matchCount} fixtures synced
              </Badge>
            </div>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              World Cup Groups 2026
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
              Track the World Cup 2026 groups, current standings, group-stage schedule,
              projected points, and AI predictions for every group match.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/matches"
                className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3 text-sm font-bold text-emerald-950 hover:bg-lime-200"
              >
                Open full schedule
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/score-simulator"
                className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-bold text-white hover:bg-white/14"
              >
                AI score simulator
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800/70">
                  Group stage standings
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
                  {groupStageMatches} group fixtures, sorted by projected table
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-emerald-950/62">
                Completed matches use final scores. Unplayed matches use the site model's
                predicted score, so projected points will change as real results arrive.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {groups.map((group) => (
                <article
                  key={group.name}
                  className="overflow-hidden rounded-lg border border-emerald-950/12 bg-white/78 shadow-sm"
                >
                  <div className="border-b border-emerald-950/10 bg-[#07130f] p-5 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl font-black tracking-tight">{group.name}</h3>
                      <span className="inline-flex items-center gap-2 rounded-full border border-lime-200/20 bg-lime-200/12 px-3 py-1 text-xs font-bold text-lime-100">
                        <ListOrdered className="size-3.5" />
                        standings
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto p-5">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead className="text-xs uppercase tracking-[0.14em] text-emerald-950/48">
                        <tr>
                          <th className="pb-3 font-bold">Team</th>
                          <th className="pb-3 text-center font-bold">P</th>
                          <th className="pb-3 text-center font-bold">Pts</th>
                          <th className="pb-3 text-center font-bold">GD</th>
                          <th className="pb-3 text-center font-bold">Proj</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-950/10">
                        {group.standings.map((team, index) => (
                          <tr key={team.team}>
                            <td className="py-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <span className="w-5 text-xs font-bold text-emerald-950/45">
                                  {index + 1}
                                </span>
                                <TeamFlagMark team={team.team} compact className="border-emerald-950/12 bg-emerald-950/[0.04]" />
                                <span className="min-w-0 break-words font-semibold text-emerald-950">
                                  {team.team}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 text-center font-mono text-emerald-950/70">{team.played}</td>
                            <td className="py-3 text-center font-mono font-bold text-emerald-950">{team.points}</td>
                            <td className="py-3 text-center font-mono text-emerald-950/70">
                              {team.goalsFor - team.goalsAgainst}
                            </td>
                            <td className="py-3 text-center font-mono font-bold text-emerald-700">
                              {team.projectedPoints}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-emerald-950/10 p-5">
                    <h4 className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-950/55">
                      <CalendarDays className="size-4 text-emerald-800" />
                      Group schedule and predictions
                    </h4>
                    <div className="grid gap-2">
                      {group.matches.map((match) => (
                        <Link
                          key={match.id}
                          href={`/matches/${match.slug}`}
                          className="group/link flex flex-col gap-2 rounded-md border border-emerald-950/10 bg-[#f8fbf7] p-3 text-sm hover:border-emerald-800/35 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="font-semibold text-emerald-950">
                            {match.teamA} vs {match.teamB}
                          </span>
                          <span className="inline-flex items-center gap-2 text-xs text-emerald-950/58">
                            {match.date} - {match.score?.ft ? 'FT' : 'AI'} {getDisplayScore(match)}
                            <Trophy className="size-3.5 text-lime-700" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute('/groups')({
  loader: async () => getWorldCupMatchesFn(),
  head: () => {
    const locale = getLocale();
    const title = `World Cup Groups 2026 | Schedule, Standings & Predictions`;
    const description =
      'Track World Cup 2026 groups, current standings, group-stage schedule, projected points, AI match predictions, and official fixture pages in one hub.';
    return {
      meta: buildSeoMeta({
        title,
        description,
        path: '/groups',
        keywords:
          'worldcup groups, worldcup standings, worldcup schedule, World Cup 2026 groups, World Cup predictions',
      }),
      links: buildSeoLinks('/groups', locale),
    };
  },
  component: GroupsPage,
});
