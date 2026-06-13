import { and, desc, eq, isNull } from 'drizzle-orm';
import { worldcupFanPick, type WorldcupFanPick } from '@/config/db/schema';
import { db } from '@/core/db';
import { getUuid } from '@/lib/hash';
import type { WorldCupMatch } from '@/lib/worldcup';

export type FanPickChoice = 'home' | 'draw' | 'away';
export type FanPickStatus = 'pending' | 'settled';

export const FAN_PICK_OUTCOME_REWARD_CREDITS = 10;
export const FAN_PICK_EXACT_SCORE_REWARD_CREDITS = 30;

export function normalizePredictedScore(value?: string) {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  const match = trimmed.match(/^(\d{1,2})\s*[-:]\s*(\d{1,2})$/);
  if (!match) return '';
  return `${Number(match[1])}-${Number(match[2])}`;
}

export function resolveMatchOutcome(match: WorldCupMatch): FanPickChoice | null {
  const ft = match.score?.ft;
  if (!ft) return null;
  if (ft[0] > ft[1]) return 'home';
  if (ft[0] < ft[1]) return 'away';
  return 'draw';
}

export function evaluateFanPick({
  match,
  pick,
  predictedScore,
}: {
  match: WorldCupMatch;
  pick: FanPickChoice;
  predictedScore: string;
}) {
  const outcome = resolveMatchOutcome(match);
  if (!outcome) {
    return {
      status: 'pending' as const,
      rewardCredits: 0,
      rewardReason: '',
      cardTitle: buildCardTitle(match, pick, predictedScore, 0),
      cardTheme: buildCardTheme(match, pick),
    };
  }

  const finalScore = `${match.score!.ft![0]}-${match.score!.ft![1]}`;
  const exactScore = predictedScore === finalScore;
  const correctOutcome = pick === outcome;
  const rewardCredits = exactScore
    ? FAN_PICK_EXACT_SCORE_REWARD_CREDITS
    : correctOutcome
    ? FAN_PICK_OUTCOME_REWARD_CREDITS
    : 0;

  return {
    status: 'settled' as const,
    rewardCredits,
    rewardReason: exactScore ? 'exact-score' : correctOutcome ? 'correct-outcome' : 'miss',
    cardTitle: buildCardTitle(match, pick, predictedScore, rewardCredits),
    cardTheme: buildCardTheme(match, pick),
  };
}

export async function getFanPickByMatch(params: {
  userId: string;
  matchSlug: string;
}) {
  const [pick] = await db()
    .select()
    .from(worldcupFanPick)
    .where(
      and(
        eq(worldcupFanPick.userId, params.userId),
        eq(worldcupFanPick.matchSlug, params.matchSlug),
        isNull(worldcupFanPick.deletedAt)
      )
    )
    .limit(1);

  return pick ?? null;
}

export async function listFanPicks(userId: string) {
  return db()
    .select()
    .from(worldcupFanPick)
    .where(and(eq(worldcupFanPick.userId, userId), isNull(worldcupFanPick.deletedAt)))
    .orderBy(desc(worldcupFanPick.createdAt));
}

export async function saveFanPick(params: {
  userId: string;
  userEmail?: string;
  matchSlug: string;
  pick: FanPickChoice;
  predictedScore?: string;
}) {
  const existing = await getFanPickByMatch({
    userId: params.userId,
    matchSlug: params.matchSlug,
  });
  const predictedScore = normalizePredictedScore(params.predictedScore);

  if (existing?.status === 'settled') return existing;

  if (existing) {
    await db()
      .update(worldcupFanPick)
      .set({
        pick: params.pick,
        predictedScore,
        userEmail: params.userEmail || existing.userEmail || '',
        updatedAt: new Date(),
      })
      .where(eq(worldcupFanPick.id, existing.id));

    return getFanPickByMatch({
      userId: params.userId,
      matchSlug: params.matchSlug,
    }) as Promise<WorldcupFanPick>;
  }

  await db().insert(worldcupFanPick).values({
    id: getUuid(),
    userId: params.userId,
    userEmail: params.userEmail || '',
    matchSlug: params.matchSlug,
    pick: params.pick,
    predictedScore,
    status: 'pending',
  });

  return getFanPickByMatch({
    userId: params.userId,
    matchSlug: params.matchSlug,
  }) as Promise<WorldcupFanPick>;
}

export async function settleFanPick(params: {
  id: string;
  rewardCredits: number;
  rewardReason: string;
  cardTitle: string;
  cardTheme: string;
}) {
  await db()
    .update(worldcupFanPick)
    .set({
      status: 'settled',
      rewardCredits: params.rewardCredits,
      rewardReason: params.rewardReason,
      cardTitle: params.cardTitle,
      cardTheme: params.cardTheme,
      settledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(worldcupFanPick.id, params.id));

  const [pick] = await db()
    .select()
    .from(worldcupFanPick)
    .where(eq(worldcupFanPick.id, params.id))
    .limit(1);

  return pick ?? null;
}

function buildCardTitle(match: WorldCupMatch, pick: FanPickChoice, score: string, rewardCredits: number) {
  if (rewardCredits === FAN_PICK_EXACT_SCORE_REWARD_CREDITS) {
    return `Perfect call: ${match.teamA} ${score} ${match.teamB}`;
  }
  if (rewardCredits > 0) {
    return `Correct side: ${pickLabel(match, pick)}`;
  }
  return `Fan pick locked: ${pickLabel(match, pick)}`;
}

function buildCardTheme(match: WorldCupMatch, pick: FanPickChoice) {
  const picked = pickLabel(match, pick).replace(/\s+/g, '-').toLowerCase();
  return `${picked}-neon-cup`;
}

function pickLabel(match: WorldCupMatch, pick: FanPickChoice) {
  if (pick === 'home') return match.teamA;
  if (pick === 'away') return match.teamB;
  return 'Draw';
}
