import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { hasPermission } from '@/modules/rbac/service';
import {
  getSyncedWorldCupMatches,
  getSyncedWorldCupMatchSeeds,
  getWorldCupSyncStatus,
  runWorldCupSync,
} from '@/modules/worldcup-sync/service';
import {
  compareMatchesByKickoff,
  getFinalScore,
  getMatchKickoffDate,
} from '@/lib/worldcup';
import { respData, respErr } from '@/lib/resp';

type AdminMatchStatus = 'upcoming' | 'live_or_pending' | 'completed' | 'stale';

async function requireAdmin(request: Request) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return { error: 'Unauthorized' as const };

  const isAdmin = await hasPermission(session.user.id, 'admin.*');
  if (!isAdmin) return { error: 'Forbidden' as const };

  return { userId: session.user.id };
}

async function buildDashboardPayload() {
  const [status, seeds, matches] = await Promise.all([
    getWorldCupSyncStatus(),
    getSyncedWorldCupMatchSeeds(),
    getSyncedWorldCupMatches(),
  ]);
  const now = new Date();
  const sortedMatches = [...matches].sort(compareMatchesByKickoff);

  const rows = sortedMatches.map((match) => {
    const kickoff = getMatchKickoffDate(match);
    const kickoffAt = kickoff?.toISOString() ?? null;
    const finalScore = getFinalScore(match);
    const isLiveOrPending =
      !finalScore &&
      kickoff &&
      kickoff.getTime() <= now.getTime() &&
      kickoff.getTime() + 4 * 60 * 60 * 1000 >= now.getTime();
    const statusLabel: AdminMatchStatus = finalScore
      ? 'completed'
      : isLiveOrPending
        ? 'live_or_pending'
        : kickoff && kickoff.getTime() > now.getTime()
          ? 'upcoming'
          : 'stale';

    return {
      id: match.id,
      round: match.round,
      group: match.group ?? null,
      date: match.date,
      time: match.time,
      kickoffAt,
      teamA: match.teamA,
      teamB: match.teamB,
      ground: match.ground,
      score: finalScore,
      status: statusLabel,
      slug: match.slug,
      watchSlug: match.watchSlug,
    };
  });

  const completed = rows.filter((match) => match.status === 'completed').length;
  const upcoming = rows.filter((match) => match.status === 'upcoming').length;
  const liveOrPending = rows.filter((match) => match.status === 'live_or_pending').length;
  const stale = rows.filter((match) => match.status === 'stale').length;
  const nextMatch = rows.find((match) => match.status === 'upcoming') ?? null;

  return {
    status,
    summary: {
      total: rows.length,
      completed,
      upcoming,
      liveOrPending,
      stale,
      usingFallbackSnapshot: !status.lastSyncedAt,
      nextMatch,
    },
    matches: rows,
    rawJson: JSON.stringify(
      {
        sourceUrl: status.sourceUrl,
        sourceName: status.sourceName ?? 'World Cup 2026',
        lastSyncedAt: status.lastSyncedAt ?? null,
        snapshotType: status.lastSyncedAt ? 'synced' : 'bundled-fallback',
        matches: seeds,
      },
      null,
      2
    ),
  };
}

async function GET({ request }: { request: Request }) {
  try {
    const admin = await requireAdmin(request);
    if ('error' in admin) return respErr(admin.error);

    return respData(await buildDashboardPayload());
  } catch (error: any) {
    return respErr(error?.message || 'Failed to load World Cup sync data');
  }
}

async function POST({ request }: { request: Request }) {
  try {
    const admin = await requireAdmin(request);
    if ('error' in admin) return respErr(admin.error);

    await runWorldCupSync('admin-manual');
    return respData(await buildDashboardPayload());
  } catch (error: any) {
    return respErr(error?.message || 'World Cup sync failed');
  }
}

export const Route = createFileRoute('/api/admin/worldcup-sync')({
  server: {
    handlers: { GET, POST },
  },
});
