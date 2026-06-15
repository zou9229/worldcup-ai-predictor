import { eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { config } from '@/config/db/schema';
import { worldCupMatches, type WorldCupMatchSeed } from '@/data/worldcup-matches';
import {
  buildWorldCupMatches,
  compareMatchesByKickoff,
  getLegacyWatchSlug,
  isFeaturedMatchCandidate,
  type WorldCupMatch,
} from '@/lib/worldcup';

const SOURCE_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';
const SNAPSHOT_KEY = 'worldcup.schedule.snapshot';
const STATUS_KEY = 'worldcup.schedule.status';
const MIN_FIXTURE_COUNT = 80;
const SEEDS_CACHE_TTL_MS = 5 * 60 * 1000;
const MATCHES_CACHE_TTL_MS = 5 * 60 * 1000;
const STATUS_CACHE_TTL_MS = 5 * 60 * 1000;

export interface WorldCupSyncStatus {
  ok: boolean;
  sourceUrl: string;
  matchCount: number;
  lastSyncedAt?: string;
  error?: string;
  sourceName?: string;
}

type SourceMatch = {
  round?: string;
  num?: number;
  date?: string;
  time?: string;
  team1?: string;
  team2?: string;
  group?: string;
  ground?: string;
  score?: {
    ft?: [number, number];
    ht?: [number, number];
  };
};

let seedsCache:
  | {
      expiresAt: number;
      value: WorldCupMatchSeed[];
    }
  | null = null;
let matchesCache:
  | {
      expiresAt: number;
      value: WorldCupMatch[];
    }
  | null = null;
let statusCache:
  | {
      expiresAt: number;
      value: WorldCupSyncStatus;
    }
  | null = null;

function isCacheValid(cache: { expiresAt: number } | null): boolean {
  return !!cache && cache.expiresAt > Date.now();
}

function clearWorldCupRuntimeCache(): void {
  seedsCache = null;
  matchesCache = null;
  statusCache = null;
}

function normalizeSourceMatch(match: SourceMatch, index: number): WorldCupMatchSeed | null {
  if (!match?.date || !match?.time || !match?.team1 || !match?.team2 || !match?.round) {
    return null;
  }

  const idNumber = match.num ?? index + 1;
  const score = match.score?.ft
    ? {
        ft: match.score.ft,
        ...(match.score.ht ? { ht: match.score.ht } : {}),
      }
    : undefined;

  return {
    id: `m${String(idNumber).padStart(3, '0')}`,
    round: match.round,
    date: match.date,
    time: match.time,
    teamA: match.team1,
    teamB: match.team2,
    ...(match.group ? { group: match.group } : {}),
    ground: match.ground || 'TBD',
    ...(score ? { score } : {}),
  };
}

function normalizeSourcePayload(payload: any): WorldCupMatchSeed[] {
  if (!Array.isArray(payload?.matches)) {
    throw new Error('World Cup source did not include a matches array.');
  }

  const matches = payload.matches
    .map((match: SourceMatch, index: number) => normalizeSourceMatch(match, index))
    .filter(Boolean) as WorldCupMatchSeed[];

  if (matches.length < MIN_FIXTURE_COUNT) {
    throw new Error(`World Cup source returned only ${matches.length} usable fixtures.`);
  }

  return matches;
}

async function readConfigValue(name: string): Promise<string | undefined> {
  const [row] = await db().select().from(config).where(eq(config.name, name)).limit(1);
  return row?.value ?? undefined;
}

async function writeConfigValue(name: string, value: string): Promise<void> {
  await db().transaction(async (tx: any) => {
    const [existing] = await tx.select().from(config).where(eq(config.name, name)).limit(1);

    if (existing) {
      await tx.update(config).set({ value }).where(eq(config.name, name));
    } else {
      await tx.insert(config).values({ name, value });
    }
  });
}

async function loadSyncedSeeds(): Promise<WorldCupMatchSeed[] | null> {
  try {
    const raw = await readConfigValue(SNAPSHOT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < MIN_FIXTURE_COUNT) return null;

    return parsed;
  } catch {
    return null;
  }
}

export async function runWorldCupSync(reason = 'manual'): Promise<WorldCupSyncStatus> {
  const statusBase = {
    sourceUrl: SOURCE_URL,
    lastSyncedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(SOURCE_URL, {
      headers: {
        accept: 'application/json',
        'user-agent': 'worldcup-ai-predictor/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`World Cup source responded ${response.status}.`);
    }

    const payload = await response.json();
    const matches = normalizeSourcePayload(payload);
    const status: WorldCupSyncStatus = {
      ...statusBase,
      ok: true,
      matchCount: matches.length,
      sourceName: payload?.name || 'World Cup 2026',
    };

    await writeConfigValue(SNAPSHOT_KEY, JSON.stringify(matches));
    await writeConfigValue(
      STATUS_KEY,
      JSON.stringify({
        ...status,
        reason,
      })
    );
    clearWorldCupRuntimeCache();
    seedsCache = {
      expiresAt: Date.now() + SEEDS_CACHE_TTL_MS,
      value: matches,
    };
    statusCache = {
      expiresAt: Date.now() + STATUS_CACHE_TTL_MS,
      value: status,
    };

    return status;
  } catch (error: any) {
    const status: WorldCupSyncStatus = {
      ...statusBase,
      ok: false,
      sourceUrl: SOURCE_URL,
      matchCount: worldCupMatches.length,
      error: error?.message || 'World Cup sync failed.',
    };
    await writeConfigValue(STATUS_KEY, JSON.stringify(status)).catch(() => {});
    statusCache = {
      expiresAt: Date.now() + STATUS_CACHE_TTL_MS,
      value: status,
    };
    return status;
  }
}

export async function getWorldCupSyncStatus(): Promise<WorldCupSyncStatus> {
  if (isCacheValid(statusCache)) {
    return statusCache.value;
  }

  try {
    const raw = await readConfigValue(STATUS_KEY);
    if (!raw) {
      const status = {
        ok: true,
        sourceUrl: SOURCE_URL,
        matchCount: worldCupMatches.length,
      };
      statusCache = {
        expiresAt: Date.now() + STATUS_CACHE_TTL_MS,
        value: status,
      };
      return status;
    }

    const status = JSON.parse(raw) as WorldCupSyncStatus;
    statusCache = {
      expiresAt: Date.now() + STATUS_CACHE_TTL_MS,
      value: status,
    };
    return status;
  } catch {
    const status = {
      ok: true,
      sourceUrl: SOURCE_URL,
      matchCount: worldCupMatches.length,
    };
    statusCache = {
      expiresAt: Date.now() + STATUS_CACHE_TTL_MS,
      value: status,
    };
    return status;
  }
}

export async function getSyncedWorldCupMatchSeeds(): Promise<WorldCupMatchSeed[]> {
  if (isCacheValid(seedsCache)) {
    return seedsCache.value;
  }

  const value = (await loadSyncedSeeds()) ?? worldCupMatches;
  seedsCache = {
    expiresAt: Date.now() + SEEDS_CACHE_TTL_MS,
    value,
  };
  matchesCache = null;
  return value;
}

export async function getSyncedWorldCupMatches(): Promise<WorldCupMatch[]> {
  if (isCacheValid(matchesCache)) {
    return matchesCache.value;
  }

  const value = buildWorldCupMatches(await getSyncedWorldCupMatchSeeds());
  matchesCache = {
    expiresAt: Date.now() + MATCHES_CACHE_TTL_MS,
    value,
  };
  return value;
}

export async function getSyncedFeaturedMatches(limit = 8): Promise<WorldCupMatch[]> {
  return (await getSyncedWorldCupMatches())
    .filter((match) => isFeaturedMatchCandidate(match))
    .sort(compareMatchesByKickoff)
    .slice(0, limit);
}

export async function getSyncedMatchBySlug(slug: string): Promise<WorldCupMatch | undefined> {
  return (await getSyncedWorldCupMatches()).find((match) => match.slug === slug);
}

export async function getSyncedMatchByWatchSlug(slug: string): Promise<WorldCupMatch | undefined> {
  return (await getSyncedWorldCupMatches()).find(
    (match) => match.watchSlug === slug || getLegacyWatchSlug(match) === slug
  );
}
