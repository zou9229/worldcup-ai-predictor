import { createFileRoute } from '@tanstack/react-router';
import { Activity, ArrowRight, Brain, Coins, Trophy } from 'lucide-react';
import { Header } from '@/blocks/header';
import { Footer } from '@/blocks/footer';
import { FootballVisual } from '@/components/worldcup/football-visual';
import { MatchCard } from '@/components/worldcup/match-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { buildSeoLinks, buildSeoMeta } from '@/lib/seo';
import { getWorldCupFeaturedMatchesFn } from '@/lib/worldcup-server';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';

function ScoreSimulatorPage() {
  const { matches } = Route.useLoaderData();
  const visualLabels = {
    liveModel: m['worldcup.visual.live_model'](),
    fixtures: m['worldcup.visual.fixtures'](),
    prediction: m['worldcup.visual.prediction'](),
    score: m['worldcup.visual.score'](),
    kickoff: m['worldcup.visual.kickoff'](),
    winProbability: m['worldcup.visual.win_probability'](),
    home: m['worldcup.visual.home'](),
    draw: m['worldcup.prediction.draw'](),
    away: m['worldcup.visual.away'](),
  };

  return (
    <div className="min-h-screen bg-[#edf4ed] text-slate-950">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden border-b border-border px-4 py-16 text-white sm:py-24">
          <FootballVisual labels={visualLabels} variant="match" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.94)_0%,rgba(3,7,18,0.74)_46%,rgba(3,7,18,0.34)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#edf4ed] to-transparent" />
          <div className="relative mx-auto max-w-6xl">
            <Badge className="border-lime-200/20 bg-lime-200/12 text-lime-100" variant="outline">{m['worldcup.score.badge']()}</Badge>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              {m['worldcup.score.title']()}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
              {m['worldcup.score.description']()}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/matches"
                className={cn(buttonVariants({ size: 'lg' }), 'gap-2 rounded-full bg-lime-300 text-zinc-950 hover:bg-lime-200')}
              >
                {m['worldcup.score.open_matches']()}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/pricing"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-full border-white/35 bg-white/8 text-white hover:bg-white/16 hover:text-white')}
              >
                {m['landing.hero.secondary']()}
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
            <InfoCard
              icon={Activity}
              title={m['worldcup.score.info_probability_title']()}
              description={m['worldcup.score.info_probability_body']()}
            />
            <InfoCard
              icon={Brain}
              title={m['worldcup.score.info_scenario_title']()}
              description={m['worldcup.score.info_scenario_body']()}
            />
            <InfoCard
              icon={Coins}
              title={m['worldcup.score.info_credit_title']()}
              description={m['worldcup.score.info_credit_body']()}
            />
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-emerald-950">
                  {m['worldcup.score.matches_title']()}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-950/62">
                  {m['worldcup.score.matches_description']()}
                </p>
              </div>
              <Trophy className="size-10 text-primary/70" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => (
                <MatchCard key={match.slug} match={match} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Activity;
  title: string;
  description: string;
}) {
  return (
    <Card className="rounded-lg border-emerald-950/10 bg-white/75 shadow-sm">
      <CardHeader>
        <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-7 text-emerald-950/62">
        {description}
      </CardContent>
    </Card>
  );
}

export const Route = createFileRoute('/score-simulator')({
  loader: async () => {
    return getWorldCupFeaturedMatchesFn({ data: { limit: 9 } });
  },
  head: () => {
    const locale = getLocale();
    const title = `${m['worldcup.score.title']({}, { locale })} | WorldCupAI Predictor`;
    const description = m['worldcup.score.description']({}, { locale });
    return {
      meta: buildSeoMeta({
        title,
        description,
        path: '/score-simulator',
        keywords: 'World Cup score simulator, World Cup 2026 score prediction, AI score predictor, football match simulator',
      }),
      links: buildSeoLinks('/score-simulator', locale),
    };
  },
  component: ScoreSimulatorPage,
});
