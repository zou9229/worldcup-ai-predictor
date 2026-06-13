import { Link } from '@/core/i18n/navigation';
import { MatchCard } from '@/components/worldcup/match-card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getFeaturedMatches, type WorldCupMatch } from '@/lib/worldcup';
import { m } from '@/paraglide/messages.js';

export function MatchesPreview({ matches: syncedMatches }: { matches?: WorldCupMatch[] } = {}) {
  const matches = syncedMatches?.length ? syncedMatches : getFeaturedMatches(6);

  return (
    <section id="matches" className="border-t border-emerald-950/10 bg-[#edf4ed] px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800/70">
              Matchday board
            </p>
            <h2 className="text-4xl font-black tracking-tight text-emerald-950 sm:text-5xl">
              {m['worldcup.home.matches_title']()}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-950/62">
              {m['worldcup.home.matches_description']()}
            </p>
          </div>
          <Link
            href="/matches"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'w-fit border-emerald-950/20 bg-white/60 text-emerald-950 hover:bg-white'
            )}
          >
            {m['worldcup.home.view_all']()}
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </section>
  );
}
