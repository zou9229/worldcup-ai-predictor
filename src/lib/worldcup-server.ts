import { createServerFn } from '@tanstack/react-start';

async function worldCupService() {
  return import('@/modules/worldcup-sync/service');
}

export const getWorldCupHomeFn = createServerFn().handler(async () => {
  const { getSyncedFeaturedMatches, getWorldCupSyncStatus } = await worldCupService();
  const [featuredMatches, syncStatus] = await Promise.all([
    getSyncedFeaturedMatches(8),
    getWorldCupSyncStatus(),
  ]);

  return { featuredMatches, syncStatus };
});

export const getWorldCupMatchesFn = createServerFn().handler(async () => {
  const { getSyncedWorldCupMatches, getWorldCupSyncStatus } = await worldCupService();
  const [matches, syncStatus] = await Promise.all([
    getSyncedWorldCupMatches(),
    getWorldCupSyncStatus(),
  ]);

  return { matches, syncStatus };
});

export const getWorldCupFeaturedMatchesFn = createServerFn()
  .inputValidator((data: { limit?: number }) => data)
  .handler(async ({ data }) => {
    const { getSyncedFeaturedMatches } = await worldCupService();
    return { matches: await getSyncedFeaturedMatches(data.limit ?? 9) };
  });

export const getWorldCupMatchFn = createServerFn()
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getSyncedMatchBySlug } = await worldCupService();
    return { match: (await getSyncedMatchBySlug(data.slug)) ?? null };
  });

export const getWorldCupWatchMatchFn = createServerFn()
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getSyncedMatchByWatchSlug } = await worldCupService();
    return { match: (await getSyncedMatchByWatchSlug(data.slug)) ?? null };
  });
