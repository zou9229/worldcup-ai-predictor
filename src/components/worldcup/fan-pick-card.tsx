import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Award, Check, Loader2, Lock, Sparkles, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/core/auth/client';
import { useRouter } from '@/core/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TeamFlagMark } from '@/components/worldcup/team-flag';
import { apiGet, apiPost } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import type { WorldCupMatch } from '@/lib/worldcup';
import { m } from '@/paraglide/messages.js';

type FanPickChoice = 'home' | 'draw' | 'away';

interface FanPick {
  id: string;
  matchSlug: string;
  pick: FanPickChoice;
  predictedScore: string;
  status: 'pending' | 'settled';
  rewardCredits: number;
  rewardReason: string;
  cardTitle: string;
  cardTheme: string;
}

interface FanPickResponse {
  pick: FanPick | null;
  rewardGranted?: boolean;
  rewards: {
    outcome: number;
    exactScore: number;
  };
}

export function FanPickCard({ match }: { match: WorldCupMatch }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [selected, setSelected] = useState<FanPickChoice>('home');
  const [score, setScore] = useState(match.prediction.predictedScore);
  const queryKey = ['worldcup-fan-pick', match.slug];
  const picksClosed = !!match.score?.ft;

  const pickQuery = useQuery({
    queryKey,
    queryFn: () =>
      apiGet<FanPickResponse>(
        `/api/worldcup-picks?matchSlug=${encodeURIComponent(match.slug)}`
      ),
    enabled: !!session?.user,
  });
  const savedPick = pickQuery.data?.pick ?? null;
  const rewards = pickQuery.data?.rewards ?? { outcome: 10, exactScore: 30 };
  const locked = savedPick?.status === 'settled' || (picksClosed && !savedPick);

  useEffect(() => {
    if (!savedPick) return;
    setSelected(savedPick.pick);
    if (savedPick.predictedScore) setScore(savedPick.predictedScore);
  }, [savedPick]);

  const mutation = useMutation({
    mutationFn: () =>
      apiPost<FanPickResponse>('/api/worldcup-picks', {
        matchSlug: match.slug,
        pick: selected,
        predictedScore: score,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
      if (data.pick?.status === 'settled' && data.pick.rewardCredits > 0) {
        toast.success(
          m['worldcup.picks.reward_toast']({ credits: data.pick.rewardCredits })
        );
      } else {
        toast.success(m['worldcup.picks.saved_toast']());
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function signIn() {
    const redirect = encodeURIComponent(
      typeof window !== 'undefined' ? window.location.pathname : `/matches/${match.slug}`
    );
    router.push(`/sign-in?redirect=${redirect}`);
  }

  function submitPick() {
    if (!session?.user) {
      signIn();
      return;
    }
    if (locked) return;
    mutation.mutate();
  }

  return (
    <Card className="overflow-hidden rounded-lg border-lime-300/25 bg-[#07130f] text-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="size-5 text-lime-200" />
          {m['worldcup.picks.title']()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-white/66">
          {m['worldcup.picks.description']({
            outcome: rewards.outcome,
            exact: rewards.exactScore,
          })}
        </p>

        <div className="grid gap-2 sm:grid-cols-3">
          <PickButton
            active={selected === 'home'}
            disabled={locked}
            label={match.teamA}
            icon={<TeamFlagMark team={match.teamA} compact className="border-white/10 bg-white/10" />}
            onClick={() => setSelected('home')}
          />
          <PickButton
            active={selected === 'draw'}
            disabled={locked}
            label={m['worldcup.prediction.draw']()}
            icon={<Award className="size-4 text-lime-200" />}
            onClick={() => setSelected('draw')}
          />
          <PickButton
            active={selected === 'away'}
            disabled={locked}
            label={match.teamB}
            icon={<TeamFlagMark team={match.teamB} compact className="border-white/10 bg-white/10" />}
            onClick={() => setSelected('away')}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="grid gap-2 text-sm font-medium text-white/78">
            {m['worldcup.picks.score_label']()}
            <Input
              value={score}
              onChange={(event) => setScore(event.target.value)}
              disabled={locked}
              placeholder="2-1"
              inputMode="numeric"
              className="border-white/10 bg-white/10 text-white placeholder:text-white/35"
            />
          </label>
          <Button
            type="button"
            onClick={submitPick}
            disabled={mutation.isPending || locked}
            className="gap-2 bg-lime-300 text-zinc-950 hover:bg-lime-200"
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : session?.user ? (
              locked ? (
                <Lock className="size-4" />
              ) : (
                <Check className="size-4" />
              )
            ) : (
              <Lock className="size-4" />
            )}
            {session?.user
              ? locked
                ? m['worldcup.picks.locked']()
                : m['worldcup.picks.submit']()
              : m['worldcup.picks.sign_in']()}
          </Button>
        </div>

        <div className="rounded-md border border-white/10 bg-white/[0.06] p-3 text-xs leading-5 text-white/56">
          {m['worldcup.picks.rule']({ outcome: rewards.outcome, exact: rewards.exactScore })}
        </div>

        {savedPick ? <FanRewardCard match={match} pick={savedPick} /> : null}
      </CardContent>
    </Card>
  );
}

function PickButton({
  active,
  disabled,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex min-h-20 min-w-0 flex-col justify-between rounded-lg border p-3 text-left transition-colors',
        active
          ? 'border-lime-300 bg-lime-300 text-zinc-950'
          : 'border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]',
        disabled ? 'cursor-not-allowed opacity-65' : ''
      )}
    >
      <span className="flex items-center gap-2">{icon}</span>
      <span className="mt-3 break-words text-sm font-bold leading-tight">{label}</span>
    </button>
  );
}

function FanRewardCard({ match, pick }: { match: WorldCupMatch; pick: FanPick }) {
  const settled = pick.status === 'settled';
  const rewardText = settled
    ? pick.rewardCredits > 0
      ? m['worldcup.picks.reward_text']({ credits: pick.rewardCredits })
      : m['worldcup.picks.no_reward']()
    : m['worldcup.picks.pending']();

  return (
    <div className="relative overflow-hidden rounded-lg border border-lime-200/20 bg-[radial-gradient(circle_at_20%_20%,rgba(190,242,100,0.25),transparent_28%),linear-gradient(135deg,#111827,#052e1c_58%,#020617)] p-4">
      <div className="absolute right-[-42px] top-[-42px] size-32 rounded-full border border-lime-200/20 bg-lime-200/10" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-lime-100/68">
            {m['worldcup.picks.card_badge']()}
          </p>
          <h3 className="mt-2 text-xl font-black leading-tight text-white">
            {pick.cardTitle || `${match.teamA} vs ${match.teamB}`}
          </h3>
          <p className="mt-2 text-sm text-white/62">{rewardText}</p>
        </div>
        <div className="flex min-w-36 items-center justify-center gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
          <Sparkles className="size-5 text-lime-200" />
          <span className="font-mono text-lg font-bold text-white">
            {pick.predictedScore || match.prediction.predictedScore}
          </span>
        </div>
      </div>
    </div>
  );
}
