import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { getAuth } from '@/core/auth';
import { grant } from '@/modules/credits/service';
import { getSyncedMatchBySlug } from '@/modules/worldcup-sync/service';
import {
  evaluateFanPick,
  FAN_PICK_EXACT_SCORE_REWARD_CREDITS,
  FAN_PICK_OUTCOME_REWARD_CREDITS,
  getFanPickByMatch,
  listFanPicks,
  saveFanPick,
  settleFanPick,
} from '@/modules/worldcup-picks/service';
import { respData, respErr } from '@/lib/resp';

const pickSchema = z.object({
  matchSlug: z.string().min(8).max(220),
  pick: z.enum(['home', 'draw', 'away']),
  predictedScore: z.string().max(20).optional(),
});

async function getSessionUser(request: Request) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

async function GET({ request }: { request: Request }) {
  const user = await getSessionUser(request);
  if (!user) return respErr('Unauthorized');

  const url = new URL(request.url);
  const matchSlug = url.searchParams.get('matchSlug');
  if (matchSlug) {
    return respData({
      pick: await getFanPickByMatch({ userId: user.id, matchSlug }),
      rewards: {
        outcome: FAN_PICK_OUTCOME_REWARD_CREDITS,
        exactScore: FAN_PICK_EXACT_SCORE_REWARD_CREDITS,
      },
    });
  }

  return respData({
    picks: await listFanPicks(user.id),
    rewards: {
      outcome: FAN_PICK_OUTCOME_REWARD_CREDITS,
      exactScore: FAN_PICK_EXACT_SCORE_REWARD_CREDITS,
    },
  });
}

async function POST({ request }: { request: Request }) {
  try {
    const user = await getSessionUser(request);
    if (!user) return respErr('Unauthorized');

    const body = pickSchema.parse(await request.json());
    const match = await getSyncedMatchBySlug(body.matchSlug);
    if (!match) return respErr('Match not found');

    const existing = await getFanPickByMatch({
      userId: user.id,
      matchSlug: body.matchSlug,
    });
    if (match.score?.ft && !existing) {
      return respErr('Fan picks are closed for completed matches');
    }

    const saved = await saveFanPick({
      userId: user.id,
      userEmail: user.email,
      matchSlug: body.matchSlug,
      pick: body.pick,
      predictedScore: body.predictedScore,
    });
    if (!saved) return respErr('Could not save fan pick');

    if (saved.status === 'settled') {
      return respData({
        pick: saved,
        rewards: {
          outcome: FAN_PICK_OUTCOME_REWARD_CREDITS,
          exactScore: FAN_PICK_EXACT_SCORE_REWARD_CREDITS,
        },
      });
    }

    const settlement = evaluateFanPick({
      match,
      pick: body.pick,
      predictedScore: saved.predictedScore,
    });
    let finalPick = saved;
    let rewardGranted = false;

    if (settlement.status === 'settled') {
      if (settlement.rewardCredits > 0) {
        await grant({
          userId: user.id,
          userEmail: user.email,
          credits: settlement.rewardCredits,
          scene: 'reward',
          description: `World Cup fan pick reward: ${match.teamA} vs ${match.teamB}`,
        });
        rewardGranted = true;
      }

      finalPick =
        (await settleFanPick({
          id: saved.id,
          rewardCredits: settlement.rewardCredits,
          rewardReason: settlement.rewardReason,
          cardTitle: settlement.cardTitle,
          cardTheme: settlement.cardTheme,
        })) ?? saved;
    }

    return respData({
      pick: finalPick,
      rewardGranted,
      rewards: {
        outcome: FAN_PICK_OUTCOME_REWARD_CREDITS,
        exactScore: FAN_PICK_EXACT_SCORE_REWARD_CREDITS,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return respErr(error.issues[0]?.message || 'Invalid fan pick');
    }
    return respErr(error?.message || 'Fan pick failed');
  }
}

export const Route = createFileRoute('/api/worldcup-picks')({
  server: {
    handlers: { GET, POST },
  },
});
