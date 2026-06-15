import { createFileRoute } from '@tanstack/react-router';
import { Header } from '@/blocks/header';
import { Footer } from '@/blocks/footer';
import { MatchCard } from '@/components/worldcup/match-card';
import { Badge } from '@/components/ui/badge';
import { buildSeoLinks, buildSeoMeta } from '@/lib/seo';
import { getWorldCupMatchesFn } from '@/lib/worldcup-server';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';

function MatchesIndexPage() {
  const { matches, syncStatus } = Route.useLoaderData();
  const groupMatches = matches.filter((match) => match.group);
  const knockoutMatches = matches.filter((match) => !match.group);

  return (
    <div className="min-h-screen bg-[#edf4ed] text-slate-950">
      <Header />
      <main>
        <section className="border-b border-emerald-950/10 bg-[#07130f] px-4 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-lime-200/20 bg-lime-200/12 text-lime-100" variant="outline">
                {m['worldcup.matches.badge']()}
              </Badge>
              <Badge className="border-white/15 bg-white/8 text-white/70" variant="outline">
                {syncStatus.matchCount} fixtures
              </Badge>
            </div>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              {m['worldcup.matches.title']()}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
              {m['worldcup.matches.description']()}
            </p>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black text-emerald-950">{m['worldcup.matches.group_stage']()}</h2>
              <span className="text-sm text-emerald-950/60">{groupMatches.length} pages</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {groupMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-emerald-950/10 px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black text-emerald-950">{m['worldcup.matches.knockout_stage']()}</h2>
              <span className="text-sm text-emerald-950/60">{knockoutMatches.length} pages</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {knockoutMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute('/matches/')({
  loader: async () => {
    return getWorldCupMatchesFn();
  },
  head: () => {
    const locale = getLocale();
    const title = m['worldcup.matches.title']({}, { locale });
    const description = m['worldcup.matches.description']({}, { locale });
    return {
      meta: buildSeoMeta({
        title,
        description,
        path: '/matches',
        keywords: 'worldcup schedule, World Cup 2026 schedule, worldcup games, World Cup fixtures, AI predictions',
      }),
      links: buildSeoLinks('/matches', locale),
    };
  },
  component: MatchesIndexPage,
});
