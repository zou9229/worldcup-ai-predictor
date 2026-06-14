import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';

async function cachedResponse(
  request: Request,
  render: () => Promise<Response> | Response
): Promise<Response> {
  if (typeof caches === 'undefined') {
    return render();
  }

  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await render();
  if (response.ok) {
    await cache.put(request, response.clone());
  }
  return response;
}

function renderRobotsTxt(): Response {
  const body = [
    'User-Agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /settings',
    'Disallow: /api/',
    'Disallow: /*?*',
    '',
    `Sitemap: ${envConfigs.app_url}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) =>
        cachedResponse(request, () => renderRobotsTxt()),
    },
  },
});
