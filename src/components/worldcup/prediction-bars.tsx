import { m } from '@/paraglide/messages.js';
import type { PredictionResult } from '@/lib/worldcup';

export function PredictionBars({
  teamA,
  teamB,
  prediction,
}: {
  teamA: string;
  teamB: string;
  prediction: PredictionResult;
}) {
  const rows = [
    { label: teamA, value: prediction.homeWin, className: 'bg-emerald-500' },
    { label: m['worldcup.prediction.draw'](), value: prediction.draw, className: 'bg-sky-500' },
    { label: teamB, value: prediction.awayWin, className: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1.5">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-medium">{row.label}</span>
            <span className="font-mono text-muted-foreground">{row.value}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${row.className}`}
              style={{ width: `${row.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
