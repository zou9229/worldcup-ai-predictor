import { envConfigs } from '@/config';
import { baseLocale, locales, localizeUrl } from '@/paraglide/runtime.js';

const DEFAULT_SOCIAL_IMAGE = '/favicon.svg';

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  const base = envConfigs.app_url.replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function localizedUrl(path: string, locale: string) {
  return localizeUrl(absoluteUrl(path || '/'), {
    locale: locale as (typeof locales)[number],
  }).href;
}

export function buildSeoLinks(path: string, locale = baseLocale) {
  return [
    { rel: 'canonical', href: localizedUrl(path, locale) },
    ...locales.map((loc) => ({
      rel: 'alternate',
      hrefLang: loc,
      href: localizedUrl(path, loc),
    })),
    {
      rel: 'alternate',
      hrefLang: 'x-default',
      href: localizedUrl(path, baseLocale),
    },
  ];
}

export function buildSeoMeta({
  title,
  description,
  path,
  keywords,
  image = DEFAULT_SOCIAL_IMAGE,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
}) {
  const url = absoluteUrl(path || '/');
  const imageUrl = absoluteUrl(image);

  return [
    { title },
    { name: 'description', content: description },
    keywords ? { name: 'keywords', content: keywords } : null,
    { name: 'application-name', content: envConfigs.app_name },
    { name: 'distribution', content: 'global' },
    { name: 'coverage', content: 'Worldwide' },
    { name: 'audience', content: 'football fans, soccer fans, World Cup viewers' },
    { property: 'og:site_name', content: envConfigs.app_name },
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: imageUrl },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ].filter((meta): meta is Exclude<typeof meta, null> => meta !== null);
}
