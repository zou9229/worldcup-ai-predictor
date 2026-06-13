import { Activity, Gauge, Radio, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FootballVisualLabels {
  liveModel: string;
  fixtures: string;
  prediction: string;
  score: string;
  kickoff: string;
  winProbability: string;
  home: string;
  draw: string;
  away: string;
}

interface FootballVisualProps {
  labels: FootballVisualLabels;
  className?: string;
  variant?: 'hero' | 'match';
}

export function FootballVisual({
  labels,
  className,
  variant = 'hero',
}: FootballVisualProps) {
  const compact = variant === 'match';

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(132,204,22,0.28),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_55%_85%,rgba(239,68,68,0.20),transparent_24%),linear-gradient(135deg,#04130d_0%,#0b1c16_42%,#111827_100%)]" />
      <div className="worldcup-stadium-lights absolute inset-x-0 top-0 h-56 opacity-80" />
      <div className="worldcup-scanline absolute inset-0 opacity-25" />

      <div className="absolute inset-x-0 bottom-[-10%] mx-auto h-[70%] max-w-7xl px-4">
        <div className="worldcup-pitch relative mx-auto h-full max-w-5xl overflow-hidden rounded-lg border border-white/15 bg-emerald-950/40 shadow-2xl shadow-black/40">
          <div className="absolute inset-6 rounded-lg border border-white/42" />
          <div className="absolute left-1/2 top-6 bottom-6 w-px bg-white/42" />
          <div className="absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/42 sm:size-48" />
          <div className="absolute left-6 top-1/2 h-32 w-20 -translate-y-1/2 rounded-r-lg border border-l-0 border-white/42 sm:h-44 sm:w-32" />
          <div className="absolute right-6 top-1/2 h-32 w-20 -translate-y-1/2 rounded-l-lg border border-r-0 border-white/42 sm:h-44 sm:w-32" />
          <div className="worldcup-route absolute left-[18%] top-[40%] h-px w-[62%] bg-lime-300/70" />
          <div className="worldcup-ball absolute left-[18%] top-[38%] size-9 rounded-full shadow-lg shadow-lime-300/25" />
          <div className="absolute bottom-10 left-[14%] h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_24px_rgba(190,242,100,0.9)]" />
          <div className="absolute bottom-20 right-[18%] h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_24px_rgba(125,211,252,0.9)]" />
        </div>
      </div>

      <div className="absolute left-4 top-8 hidden w-52 rounded-lg border border-white/15 bg-black/28 p-4 text-white shadow-xl backdrop-blur-md sm:block lg:left-[8%]">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase text-white/65">
          <Activity className="size-3.5 text-lime-300" />
          {labels.liveModel}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-white/10 p-2">
            <div className="font-mono text-lg text-lime-200">44%</div>
            <div className="text-[10px] text-white/55">{labels.home}</div>
          </div>
          <div className="rounded-md bg-white/10 p-2">
            <div className="font-mono text-lg text-white">27%</div>
            <div className="text-[10px] text-white/55">{labels.draw}</div>
          </div>
          <div className="rounded-md bg-white/10 p-2">
            <div className="font-mono text-lg text-sky-200">29%</div>
            <div className="text-[10px] text-white/55">{labels.away}</div>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-10 hidden w-56 rounded-lg border border-white/15 bg-black/28 p-4 text-white shadow-xl backdrop-blur-md md:block lg:right-[9%]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase text-white/60">{labels.prediction}</div>
            <div className="mt-1 font-mono text-3xl text-lime-200">{labels.score}</div>
          </div>
          <Trophy className="size-9 text-amber-200" />
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/12">
          <div className="worldcup-meter h-full rounded-full bg-gradient-to-r from-lime-300 via-sky-300 to-rose-300" />
        </div>
      </div>

      <div
        className={cn(
          'absolute bottom-8 right-6 w-64 rounded-lg border border-white/15 bg-black/30 p-4 text-white shadow-xl backdrop-blur-md',
          compact ? 'hidden lg:block' : 'hidden sm:block',
        )}
      >
        <div className="flex items-center gap-2 text-xs uppercase text-white/60">
          <Radio className="size-3.5 text-rose-300" />
          {labels.kickoff}
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-2xl font-semibold">{labels.fixtures}</div>
            <div className="text-xs text-white/55">{labels.winProbability}</div>
          </div>
          <Gauge className="size-8 text-sky-200" />
        </div>
      </div>
    </div>
  );
}
