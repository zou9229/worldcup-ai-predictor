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
  getCanonicalUrl,
  getVenueLabel,
  type WorldCupMatch,
} from '@/lib/worldcup';
import { getWorldCupMatchesFn } from '@/lib/worldcup-server';
import { TeamFlagMark } from '@/components/worldcup/team-flag';
import { m } from '@/paraglide/messages.js';

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
  head: () => ({
    meta: [
      {
        title: `${m['worldcup.watch.index_title']()} | WorldCupAI Predictor`,
      },
      {
        name: 'description',
        content: m['worldcup.watch.index_description'](),
      },
      {
        name: 'keywords',
        content: 'World Cup 2026 live stream, how to watch World Cup 2026, World Cup TV channel, World Cup watch guide',
      },
    ],
    links: [{ rel: 'canonical', href: getCanonicalUrl('/watch') }],
  }),
  component: WatchIndexPage,
});
