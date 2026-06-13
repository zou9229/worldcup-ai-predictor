import { createFileRoute } from '@tanstack/react-router';
import { CalendarDays, MapPin, ShieldCheck } from 'lucide-react';
import { Header } from '@/blocks/header';
import { Footer } from '@/blocks/footer';
import { FootballVisual } from '@/components/worldcup/football-visual';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import {
  getVenueLabel,
  type WorldCupMatch,
} from '@/lib/worldcup';
import { WORLD_CUP_BROADCASTER_GUIDES } from '@/lib/worldcup-broadcasters';
import { buildSeoLinks, buildSeoMeta } from '@/lib/seo';
import { getWorldCupMatchesFn } from '@/lib/worldcup-server';
import { TeamFlagMark } from '@/components/worldcup/team-flag';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';

function WatchIndexPage() {
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
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.94)_0%,rgba(3,7,18,0.72)_48%,rgba(3,7,18,0.34)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#edf4ed] to-transparent" />
          <div className="relative mx-auto max-w-6xl">
            <Badge className="border-lime-200/20 bg-lime-200/12 text-lime-100" variant="outline">{m['worldcup.watch.badge']()}</Badge>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              {m['worldcup.watch.index_title']()}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
              {m['worldcup.watch.index_description']()}
            </p>
          </div>
        </section>

        <BroadcasterGuideSection />

        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <WatchGuideCard key={match.slug} match={match} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function BroadcasterGuideSection() {
  return (
    <section className="border-b border-emerald-950/10 bg-white/60 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800/70">
              {m['worldcup.watch.broadcasters_badge']()}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-emerald-950">
              {m['worldcup.watch.broadcasters_title']()}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-emerald-950/62">
            {m['worldcup.watch.broadcasters_description']()}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {WORLD_CUP_BROADCASTER_GUIDES.map((region) => (
            <Card key={region.region} className="rounded-lg border-emerald-950/10 bg-white/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-emerald-950">{region.region}</CardTitle>
                <p className="text-sm leading-6 text-emerald-950/60">{region.note}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {region.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md border border-emerald-950/10 bg-emerald-950/[0.03] p-3 transition hover:border-primary/50 hover:bg-primary/10"
                  >
                    <span className="font-semibold text-emerald-950">{link.name}</span>
                    <span className="mt-1 block text-xs leading-5 text-emerald-950/56">{link.note}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-emerald-950/52">
          {m['worldcup.watch.broadcasters_source_note']()}
        </p>
      </div>
    </section>
  );
}

function WatchGuideCard({ match }: { match: WorldCupMatch }) {
  return (
    <Card className="rounded-lg border-emerald-950/10 bg-white/75 shadow-sm">
      <CardHeader>
        <div className="mb-2 flex items-center justify-between gap-3">
          <Badge variant="secondary">{match.group || match.round}</Badge>
          <span className="text-xs text-muted-foreground">{match.date}</span>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <TeamFlagMark team={match.teamA} className="border-emerald-950/10 bg-emerald-950/5 text-emerald-950" compact />
          <TeamFlagMark team={match.teamB} className="border-emerald-950/10 bg-emerald-950/5 text-emerald-950" compact />
        </div>
        <CardTitle className="text-xl leading-tight text-emerald-950">
          {match.teamA} vs {match.teamB}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-emerald-950/62">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4" />
          <span>{match.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4" />
          <span>{getVenueLabel(match.ground)}</span>
        </div>
        <div className="flex items-start gap-2 leading-6">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <span>{m['worldcup.watch.card_note']()}</span>
        </div>
        <Link
          href={`/watch/${match.watchSlug}`}
          className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
        >
          {m['worldcup.watch.view_guide']()}
        </Link>
      </CardContent>
    </Card>
  );
}

export const Route = createFileRoute('/watch/')({
  loader: async () => {
    const { matches } = await getWorldCupMatchesFn();
    return { matches: matches.slice(0, 24) };
  },
  head: () => {
    const locale = getLocale();
    const title = `${m['worldcup.watch.index_title']({}, { locale })} | WorldCupAI Predictor`;
    const description = m['worldcup.watch.index_description']({}, { locale });
    return {
      meta: buildSeoMeta({
        title,
        description,
        path: '/watch',
        keywords: 'World Cup 2026 viewing guide, how to watch World Cup 2026, World Cup TV channel, official World Cup broadcasters',
      }),
      links: buildSeoLinks('/watch', locale),
    };
  },
  component: WatchIndexPage,
});
