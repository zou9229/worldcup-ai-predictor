import { createFileRoute, notFound } from '@tanstack/react-router';
import { CalendarDays, MapPin, ShieldCheck } from 'lucide-react';
import { Header } from '@/blocks/header';
import { Footer } from '@/blocks/footer';
import { FootballVisual } from '@/components/worldcup/football-visual';
import { PredictionBars } from '@/components/worldcup/prediction-bars';
import { TeamFlagMark } from '@/components/worldcup/team-flag';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getWorldCupWatchMatchFn } from '@/lib/worldcup-server';
import { buildSeoLinks, buildSeoMeta } from '@/lib/seo';
import {
  getDisplayScore,
  getVpnAffiliateUrl,
  getWatchDescription,
  getWatchTitle,
} from '@/lib/worldcup';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';

function WatchPage() {
  const { match } = Route.useLoaderData();
  const visualLabels = {
    liveModel: m['worldcup.visual.live_model'](),
    fixtures: m['worldcup.visual.fixtures'](),
    prediction: m['worldcup.visual.prediction'](),
    score: getDisplayScore(match),
    kickoff: m['worldcup.visual.kickoff'](),
    winProbability: m['worldcup.visual.win_probability'](),
    home: match.teamA,
    draw: m['worldcup.prediction.draw'](),
    away: match.teamB,
  };

  return (
    <div className="min-h-screen bg-[#edf4ed] text-slate-950">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden border-b border-border px-4 py-14 text-white sm:py-20">
          <FootballVisual labels={visualLabels} variant="match" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.94)_0%,rgba(3,7,18,0.72)_50%,rgba(3,7,18,0.38)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#edf4ed] to-transparent" />
          <div className="relative mx-auto max-w-5xl">
            <Badge className="border-lime-200/20 bg-lime-200/12 text-lime-100" variant="outline">{m['worldcup.watch.badge']()}</Badge>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              {getWatchTitle(match)}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
              {getWatchDescription(match)}
            </p>
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article className="space-y-6">
              <Card className="rounded-lg border-emerald-950/10 bg-white/75 shadow-sm">
                <CardHeader>
                  <div className="mb-3 flex items-center gap-2">
                    <TeamFlagMark team={match.teamA} className="border-emerald-950/10 bg-emerald-950/5 text-emerald-950" compact />
                    <TeamFlagMark team={match.teamB} className="border-emerald-950/10 bg-emerald-950/5 text-emerald-950" compact />
                  </div>
                  <CardTitle>
                    {match.teamA} vs {match.teamB}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm text-emerald-950/62 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="size-5 text-primary" />
                    <span>{match.date} / {match.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="size-5 text-primary" />
                    <span>{match.ground}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-lg border-emerald-950/10 bg-white/75 shadow-sm">
                <CardHeader>
                  <CardTitle>{m['worldcup.watch.official_title']()}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-emerald-950/62">
                  <p>{m['worldcup.watch.official_body']()}</p>
                  <p>{m['worldcup.watch.travel_body']()}</p>
                </CardContent>
              </Card>

              <Card className="rounded-lg border-emerald-950/10 bg-white/75 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    {m['worldcup.watch.vpn_title']()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-emerald-950/62">
                  <p>{m['worldcup.watch.vpn_body']()}</p>
                  <a
                    href={getVpnAffiliateUrl()}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={cn(buttonVariants(), 'w-fit')}
                  >
                    {m['worldcup.affiliate.cta']()}
                  </a>
                </CardContent>
              </Card>
            </article>

            <aside className="space-y-5">
              <Card className="rounded-lg border-emerald-950/10 bg-white/75 shadow-sm">
                <CardHeader>
                  <CardTitle>{m['worldcup.match.probability_title']()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <PredictionBars
                    teamA={match.teamA}
                    teamB={match.teamB}
                    prediction={match.prediction}
                  />
                </CardContent>
              </Card>
              <div className="rounded-lg border border-dashed border-emerald-950/20 bg-white/50 p-6 text-center text-sm text-emerald-950/55">
                {m['worldcup.ads.placeholder']()}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute('/watch/$slug')({
  loader: async ({ params }) => {
    const { match } = await getWorldCupWatchMatchFn({ data: { slug: params.slug } });
    if (!match) throw notFound();
    return { match };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.match) return {};
    const match = loaderData.match;
    const locale = getLocale();
    const title =
      locale === 'en'
        ? `${getWatchTitle(match)} | WorldCupAI`
        : `${m['worldcup.watch.title']({ teamA: match.teamA, teamB: match.teamB }, { locale })} | WorldCupAI`;
    const description =
      locale === 'en'
        ? getWatchDescription(match)
        : `${m['worldcup.watch.index_description']({}, { locale })} ${match.teamA} vs ${match.teamB}.`;
    return {
      meta: buildSeoMeta({
        title,
        description,
        path: `/watch/${match.watchSlug}`,
        keywords: `how to watch ${match.teamA} vs ${match.teamB}, ${match.teamA} vs ${match.teamB} TV channel, ${match.teamA} vs ${match.teamB} official viewing guide`,
      }),
      links: buildSeoLinks(`/watch/${match.watchSlug}`, locale),
    };
  },
  component: WatchPage,
});
