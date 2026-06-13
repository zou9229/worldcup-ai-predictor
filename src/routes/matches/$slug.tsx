import { createFileRoute, notFound } from '@tanstack/react-router';
import { Activity, CalendarDays, MapPin, Radio, ShieldAlert, Trophy } from 'lucide-react';
import { Header } from '@/blocks/header';
import { Footer } from '@/blocks/footer';
import { FootballVisual } from '@/components/worldcup/football-visual';
import { SimulationForm } from '@/components/worldcup/simulation-form';
import { PredictionBars } from '@/components/worldcup/prediction-bars';
import { TeamFlagMark } from '@/components/worldcup/team-flag';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { getWorldCupMatchFn } from '@/lib/worldcup-server';
import { buildSeoLinks, buildSeoMeta } from '@/lib/seo';
import {
  getMatchDescription,
  getMatchTitle,
  getVenueLabel,
  getVpnAffiliateUrl,
  type WorldCupMatch,
} from '@/lib/worldcup';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';

function MatchPage() {
  const { match } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-[#edf4ed] text-slate-950">
      <Header />
      <main>
        <MatchHero match={match} />
        <section className="px-4 py-12">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <article className="space-y-8">
              <Card className="rounded-lg border-emerald-950/10 bg-white/75 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Activity className="size-5 text-primary" />
                    {m['worldcup.match.analysis_title']()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-emerald-950/66">
                  <p>
                    {match.prediction.angle}
                  </p>
                  <p>
                    {match.prediction.keyBattle}
                  </p>
                  <p>
                    {m['worldcup.match.predicted_score_prefix']()} <strong className="text-emerald-950">{match.prediction.predictedScore}</strong>. {m['worldcup.match.total_goals_prefix']()} <strong className="text-emerald-950">{match.prediction.totalGoalsLean}</strong>.
                  </p>
                </CardContent>
              </Card>

              <SimulationForm
                matchSlug={match.slug}
                example={`What if ${match.teamA}'s top scorer is limited to 30 minutes?`}
              />

              <Card className="rounded-lg border-emerald-950/10 bg-white/75 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Radio className="size-5 text-primary" />
                    {m['worldcup.watch.title']({ teamA: match.teamA, teamB: match.teamB })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-emerald-950/66">
                  <p>
                    {m['worldcup.watch.body']({ teamA: match.teamA, teamB: match.teamB })}
                  </p>
                  <Link
                    href={`/watch/${match.watchSlug}`}
                    className={cn(buttonVariants({ variant: 'outline' }), 'w-fit')}
                  >
                    {m['worldcup.watch.open_guide']()}
                  </Link>
                </CardContent>
              </Card>

              <div className="rounded-lg border border-dashed border-emerald-950/20 bg-white/50 p-6 text-center text-sm text-emerald-950/55">
                {m['worldcup.ads.placeholder']()}
              </div>
            </article>

            <aside className="space-y-5">
              <Card className="rounded-lg border-emerald-950/10 bg-white/75 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{m['worldcup.match.probability_title']()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <PredictionBars
                    teamA={match.teamA}
                    teamB={match.teamB}
                    prediction={match.prediction}
                  />
                </CardContent>
              </Card>

              <AffiliateCard match={match} />

              <Card className="rounded-lg border-emerald-950/10 bg-white/75 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{m['worldcup.match.disclaimer_title']()}</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-3 text-sm leading-6 text-emerald-950/62">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                  <p>{m['worldcup.match.disclaimer']()}</p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function MatchHero({ match }: { match: WorldCupMatch }) {
  const visualLabels = {
    liveModel: m['worldcup.visual.live_model'](),
    fixtures: m['worldcup.visual.fixtures'](),
    prediction: m['worldcup.visual.prediction'](),
    score: match.prediction.predictedScore,
    kickoff: m['worldcup.visual.kickoff'](),
    winProbability: m['worldcup.visual.win_probability'](),
    home: match.teamA,
    draw: m['worldcup.prediction.draw'](),
    away: match.teamB,
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-border px-4 py-14 text-white sm:py-20">
      <FootballVisual labels={visualLabels} variant="match" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.94)_0%,rgba(3,7,18,0.72)_48%,rgba(3,7,18,0.36)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#edf4ed] to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge className="border-lime-200/20 bg-lime-200/12 text-lime-100" variant="outline">{match.group || match.round}</Badge>
          <Badge className="border-white/25 bg-white/10 text-white" variant="outline">{m['worldcup.match.confidence']({ confidence: match.prediction.confidence })}</Badge>
          <Badge className="border-white/25 bg-white/10 text-white" variant="outline">Daily sync</Badge>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <TeamFlagMark team={match.teamA} />
              <TeamFlagMark team={match.teamB} />
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              <span>{match.teamA}</span>
              {' '}
              <span className="mx-3 text-white/42">vs</span>
              {' '}
              <span>{match.teamB}</span>
              {' '}
              <span className="mt-2 block text-2xl text-white/64 sm:text-3xl">
                {m['worldcup.match.hero_suffix']()}
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
              {getMatchDescription(match)}
            </p>
          </div>
          <Card className="rounded-lg border-white/15 bg-black/30 text-white shadow-xl backdrop-blur-md">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="size-5 text-lime-200" />
                <div>
                  <p className="text-sm font-medium">{match.date}</p>
                  <p className="text-sm text-white/62">{match.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-sky-200" />
                <div>
                  <p className="text-sm font-medium">{getVenueLabel(match.ground)}</p>
                  <p className="text-sm text-white/62">{match.ground}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="size-5 text-amber-200" />
                <div>
                  <p className="text-sm font-medium">{m['worldcup.match.predicted_score']()}</p>
                  <p className="text-sm text-white/62">{match.prediction.predictedScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function AffiliateCard({ match }: { match: WorldCupMatch }) {
  return (
    <Card className="rounded-lg border-primary/30 bg-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="text-lg">
          {m['worldcup.affiliate.title']({ teamA: match.teamA, teamB: match.teamB })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-primary-foreground/80">
          {m['worldcup.affiliate.body']()}
        </p>
        <a
          href={getVpnAffiliateUrl()}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}
        >
          {m['worldcup.affiliate.cta']()}
        </a>
      </CardContent>
    </Card>
  );
}

export const Route = createFileRoute('/matches/$slug')({
  loader: async ({ params }) => {
    const { match } = await getWorldCupMatchFn({ data: { slug: params.slug } });
    if (!match) throw notFound();
    return { match };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.match) return {};
    const match = loaderData.match;
    const locale = getLocale();
    const title =
      locale === 'en'
        ? `${getMatchTitle(match)} | WorldCupAI`
        : `${match.teamA} vs ${match.teamB} | ${m['worldcup.match.hero_suffix']({}, { locale })} | WorldCupAI`;
    const description =
      locale === 'en'
        ? getMatchDescription(match)
        : `${match.teamA} vs ${match.teamB}. ${m['worldcup.matches.description']({}, { locale })}`;
    return {
      meta: buildSeoMeta({
        title,
        description,
        path: `/matches/${match.slug}`,
        keywords: `${match.teamA} vs ${match.teamB} AI prediction, ${match.teamA} vs ${match.teamB} score simulator, how to watch ${match.teamA} vs ${match.teamB} live free`,
      }),
      links: buildSeoLinks(`/matches/${match.slug}`, locale),
    };
  },
  component: MatchPage,
});
