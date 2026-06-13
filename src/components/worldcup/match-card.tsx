import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { ArrowRight, CalendarDays, MapPin, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamFlagMark } from '@/components/worldcup/team-flag';
import { getDisplayScore, type WorldCupMatch } from '@/lib/worldcup';
import { cn } from '@/lib/utils';

export function MatchCard({ match }: { match: WorldCupMatch }) {
  const displayScore = getDisplayScore(match);

  return (
    <Card className="group overflow-hidden rounded-lg border-emerald-950/20 bg-[#07130f] text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/20">
      <CardHeader className="border-b border-white/10 pb-3">
        <div className="flex items-center justify-between gap-3">
          <Badge className="border-lime-200/20 bg-lime-200/12 text-lime-100" variant="outline">
            {match.group || match.round}
          </Badge>
          <span className="font-mono text-xs text-white/55">{match.date}</span>
        </div>
        <CardTitle className="sr-only">
          {match.teamA} vs {match.teamB}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 pt-1 sm:gap-3">
          <TeamSide team={match.teamA} align="left" />
          <div className="mt-6 flex size-10 shrink-0 items-center justify-center rounded-full border border-lime-200/25 bg-lime-200/10 font-serif text-base italic text-lime-100 sm:size-12 sm:text-lg">
            vs
          </div>
          <TeamSide team={match.teamB} align="right" />
        </div>

        <div className="grid gap-2 text-sm text-white/62">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-lime-200" />
            <span>{match.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-sky-200" />
            <span>{match.ground}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-md border border-white/10 bg-white/[0.06] p-3 text-center text-xs">
          <div>
            <div className="font-mono text-base text-lime-100">{match.prediction.homeWin}%</div>
            <div className="truncate text-white/50">{match.teamA}</div>
          </div>
          <div>
            <div className="font-mono text-base text-white">{match.prediction.draw}%</div>
            <div className="text-white/50">{m['worldcup.prediction.draw']()}</div>
          </div>
          <div>
            <div className="font-mono text-base text-sky-100">{match.prediction.awayWin}%</div>
            <div className="truncate text-white/50">{match.teamB}</div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-md bg-lime-200/10 px-3 py-2 text-sm">
          <span className="inline-flex items-center gap-2 text-lime-100">
            <Trophy className="size-4" />
            {match.score?.ft ? `FT ${displayScore}` : displayScore}
          </span>
          <span className="text-xs text-white/52">{match.prediction.confidence}</span>
        </div>

        <Link
          href={`/matches/${match.slug}`}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-lime-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-lime-200"
        >
          {m['worldcup.match_card.open']()}
          <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

function TeamSide({
  team,
  align,
}: {
  team: string;
  align: 'left' | 'right';
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col',
        align === 'right' ? 'items-end text-right' : 'items-start text-left'
      )}
    >
      <TeamFlagMark
        team={team}
        compact
        className={align === 'right' ? 'ml-auto' : ''}
      />
      <div className="mt-3 max-w-full break-words text-lg font-bold leading-tight tracking-tight sm:text-xl">
        {team}
      </div>
    </div>
  );
}
