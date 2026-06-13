import { Link } from "@/core/i18n/navigation";
import { m } from "@/paraglide/messages.js";
import { ArrowRight, CalendarDays, Clock3, ShieldCheck, Trophy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FootballVisual } from "@/components/worldcup/football-visual";
import { TeamFlagMark } from "@/components/worldcup/team-flag";
import { cn } from "@/lib/utils";
import { envConfigs } from "@/config";
import { getFeaturedMatches, type WorldCupMatch } from "@/lib/worldcup";

interface HeroProps {
  featuredMatch?: WorldCupMatch;
  syncStatus?: {
    ok: boolean;
    matchCount: number;
    lastSyncedAt?: string;
  } | null;
}

export function Hero({ featuredMatch, syncStatus }: HeroProps = {}) {
  const match = featuredMatch ?? getFeaturedMatches(1)[0];
  const visualLabels = {
    liveModel: m["worldcup.visual.live_model"](),
    fixtures: m["worldcup.visual.fixtures"](),
    prediction: m["worldcup.visual.prediction"](),
    score: m["worldcup.visual.score"](),
    kickoff: m["worldcup.visual.kickoff"](),
    winProbability: m["worldcup.visual.win_probability"](),
    home: m["worldcup.visual.home"](),
    draw: m["worldcup.prediction.draw"](),
    away: m["worldcup.visual.away"](),
  };
  const syncCopy = syncStatus?.lastSyncedAt
    ? m["worldcup.hero.fixtures_synced"]({ count: syncStatus.matchCount })
    : m["worldcup.hero.fixtures_loaded"]({ count: syncStatus?.matchCount ?? 104 });

  return (
    <section className="relative isolate min-h-[82svh] overflow-hidden px-4 pb-24 pt-18 text-white sm:pt-24">
      <FootballVisual labels={visualLabels} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,8,0.95)_0%,rgba(3,10,8,0.78)_42%,rgba(3,10,8,0.34)_72%,rgba(3,10,8,0.7)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#edf4ed] via-[#edf4ed]/70 to-transparent" />

      <div className="relative mx-auto grid min-h-[58svh] w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)]">
        <div className="min-w-0 max-w-3xl space-y-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-200/20 bg-lime-200/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-lime-100">
              <Trophy className="size-3.5" />
              {envConfigs.app_name}
            </span>
            <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-white/70">
              {syncCopy}
            </span>
          </div>
          <h1 className="max-w-full text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {m["landing.hero.headline"]()}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            {m["landing.hero.subheadline"]()}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/matches"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 gap-2 rounded-full bg-lime-300 px-8 font-semibold text-zinc-950 hover:bg-lime-200"
              )}
            >
              {m["landing.hero.cta"]()}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/score-simulator"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full border-white/25 bg-white/8 px-8 text-white hover:bg-white/16 hover:text-white"
              )}
            >
              {m["worldcup.nav.simulator"]()}
            </Link>
          </div>

          <div className="grid max-w-2xl grid-cols-3 overflow-hidden rounded-lg border border-white/12 bg-black/20 text-sm backdrop-blur-md">
            <HeroStat label={m["worldcup.hero.stat_today"]()} value="2" />
            <HeroStat label={m["worldcup.hero.stat_ai"]()} value="Vertex" />
            <HeroStat
              label={m["worldcup.hero.stat_sync"]()}
              value={
                syncStatus?.ok === false
                  ? m["worldcup.hero.sync_fallback"]()
                  : m["worldcup.hero.sync_daily"]()
              }
            />
          </div>
        </div>

        {match ? (
          <HeroMatchCard match={match} />
        ) : null}
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-white/10 p-4 last:border-r-0">
      <div className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/42">
        {label}
      </div>
      <div className="mt-2 text-xl font-bold text-white">{value}</div>
    </div>
  );
}

function HeroMatchCard({ match }: { match: WorldCupMatch }) {
  return (
    <div className="w-full min-w-0 rounded-lg border border-lime-200/20 bg-[#062016]/88 p-4 shadow-2xl shadow-black/35 backdrop-blur-md sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-lime-200/12 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-lime-100">
          <CalendarDays className="size-3.5" />
          {m["worldcup.hero.today_fixtures"]()}
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
          {m["worldcup.hero.locked"]()}
        </span>
      </div>

      <div className="rounded-lg border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5">
        <div className="mb-5 flex items-center justify-between gap-4 text-xs text-white/58">
          <span>{match.group || match.round}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" />
            {match.date} / {match.time}
          </span>
        </div>

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-4">
          <HeroTeam team={match.teamA} />
          <div className="font-serif text-3xl italic text-lime-100">vs</div>
          <HeroTeam team={match.teamB} align="right" />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <ProbabilityButton label={match.teamA} value={`${match.prediction.homeWin}%`} />
          <ProbabilityButton label={m["worldcup.prediction.draw"]()} value={`${match.prediction.draw}%`} />
          <ProbabilityButton label={match.teamB} value={`${match.prediction.awayWin}%`} />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-start gap-2 rounded-md border border-lime-200/15 bg-lime-200/8 p-3 text-sm text-white/70">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-lime-200" />
            <span>{match.prediction.predictedScore} / {match.prediction.confidence}</span>
          </div>
          <Link
            href={`/matches/${match.slug}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-lime-300 px-5 text-sm font-bold text-zinc-950 hover:bg-lime-200"
          >
            {m["worldcup.hero.match_room"]()}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function HeroTeam({
  team,
  align = 'left',
}: {
  team: string;
  align?: 'left' | 'right';
}) {
  return (
    <div className={cn('min-w-0', align === 'right' ? 'text-right' : '')}>
      <TeamFlagMark team={team} className={align === 'right' ? 'ml-auto' : ''} />
      <div className="mt-3 max-w-full break-words text-xl font-black leading-tight tracking-tight sm:text-2xl">
        {team}
      </div>
    </div>
  );
}

function ProbabilityButton({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/12 bg-white/[0.04] p-3 text-center">
      <div className="font-mono text-base font-semibold text-white">{value}</div>
      <div className="mt-1 truncate text-[0.66rem] font-semibold uppercase tracking-wide text-white/42">
        {label}
      </div>
    </div>
  );
}
