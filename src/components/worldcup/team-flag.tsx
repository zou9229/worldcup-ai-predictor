import { cn } from '@/lib/utils';
import { getTeamFlag, getTeamFlagEmoji } from '@/lib/worldcup';

export function TeamFlagMark({
  team,
  className,
  compact = false,
}: {
  team: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 shadow-sm backdrop-blur',
        className
      )}
    >
      <span className={cn('leading-none', compact ? 'text-lg' : 'text-2xl')}>
        {getTeamFlagEmoji(team)}
      </span>
      <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-wide text-current/72">
        {getTeamFlag(team)}
      </span>
    </span>
  );
}
