import { cn } from '@/lib/utils';
import { getTeamFlag, getTeamFlagImageUrl } from '@/lib/worldcup';

export function TeamFlagMark({
  team,
  className,
  compact = false,
}: {
  team: string;
  className?: string;
  compact?: boolean;
}) {
  const flagUrl = getTeamFlagImageUrl(team);
  const code = getTeamFlag(team);

  return (
    <span
      className={cn(
        'inline-flex max-w-full min-w-0 items-center gap-2 overflow-hidden rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 shadow-sm backdrop-blur',
        className
      )}
    >
      {flagUrl ? (
        <img
          src={flagUrl}
          alt={`${team} flag`}
          width={compact ? 28 : 40}
          height={compact ? 20 : 28}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
          className={cn(
            'shrink-0 rounded-[3px] object-cover ring-1 ring-black/10',
            compact ? 'h-5 w-7' : 'h-7 w-10'
          )}
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-[3px] bg-lime-200/15 font-semibold',
            compact ? 'h-5 w-7 text-[0.6rem]' : 'h-7 w-10 text-[0.7rem]'
          )}
        >
          WC
        </span>
      )}
      <span className="truncate font-mono text-[0.66rem] font-semibold uppercase tracking-wide text-current/72">
        {code}
      </span>
    </span>
  );
}
