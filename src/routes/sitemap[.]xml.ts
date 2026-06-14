import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { getLocalPosts } from '@/content/posts';
import { getWorldCupMatches } from '@/lib/worldcup';
import { baseLocale, locales } from '@/paraglide/runtime.js';

const STATIC_PATHS = [
  '',
  '/matches',
  '/watch',
  '/score-simulator',
  '/pricing',
  '/privacy-policy',
  '/terms-of-service',
];

const LOCALE_PREFIXES: Record<string, string> = {
  en: '',
  zh: '/zh',
  es: '/es',
  'pt-BR': '/pt-br',
  fr: '/fr',
  de: '/de',
  it: '/it',
  ja: '/ja',
  ko: '/ko',
  ar: '/ar',
};

type Entry = {
  path: string;
  lastModified?: string;
  changeFrequency: string;
  priority: number;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlFor(path: string, locale: string): string {
  const origin = envConfigs.app_url.replace(/\/+$/, '');
  const normalizedPath = path || '/';
  const prefix = LOCALE_PREFIXES[locale] ?? '';
  const localizedPath =
    prefix && normalizedPath !== '/' ? `${prefix}${normalizedPath}` : prefix || normalizedPath;

  return escapeXml(`${origin}${localizedPath}`);
}

function entryXml(e: Entry): string {
  const alternates = locales
    .map(
      (loc) =>
        `    <xhtml:link rel="alternate" hreflang="${loc}" href="${urlFor(e.path, loc)}"/>`
    )
    .join('\n');
  const defaultAlternate = `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(e.path, baseLocale)}"/>`;

  return [
    '  <url>',
    `    <loc>${urlFor(e.path, baseLocale)}</loc>`,
    alternates,
    defaultAlternate,
    e.lastModified ? `    <lastmod>${escapeXml(e.lastModified)}</lastmod>` : null,
    `    <changefreq>${e.changeFrequency}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

const SITEMAP_CACHE_VERSION = 'sitemap-xml-v2';

function cacheRequestFor(request: Request): Request {
  const url = new URL(request.url);
  url.searchParams.set('__cache', SITEMAP_CACHE_VERSION);
  return new Request(url.toString(), request);
}

async function cachedResponse(
  request: Request,
  render: () => Promise<Response> | Response
): Promise<Response> {
  if (typeof caches === 'undefined') {
    return render();
  }

  const cache = caches.default;
  const cacheRequest = cacheRequestFor(request);
  const cached = await cache.match(cacheRequest);
  if (cached) return cached;

  const response = await render();
  if (response.ok) {
    await cache.put(cacheRequest, response.clone());
  }
  return response;
}

function renderSitemap(): Response {
  const entries: Entry[] = STATIC_PATHS.map((path) => ({
    path,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));

  // Keep sitemap generation cheap for crawlers. Live sync data is used by
  // pages; the sitemap only needs the stable URL inventory.
  for (const match of getWorldCupMatches()) {
    entries.push({
      path: `/matches/${match.slug}`,
      lastModified: match.date,
      changeFrequency: match.score?.ft ? 'monthly' : 'daily',
      priority: match.group ? 0.9 : 0.75,
    });
    entries.push({
      path: `/watch/${match.watchSlug}`,
      lastModified: match.date,
      changeFrequency: match.score?.ft ? 'monthly' : 'daily',
      priority: match.group ? 0.85 : 0.7,
    });
  }

  for (const post of getLocalPosts(baseLocale)) {
    entries.push({
      path: `/blog/${post.slug}`,
      lastModified: post.createdAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.map(entryXml),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) =>
        cachedResponse(request, () => renderSitemap()),
    },
  },
});
