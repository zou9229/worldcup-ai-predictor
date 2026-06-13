import { createFileRoute } from '@tanstack/react-router';
import { Header } from "@/blocks/header";
import { Hero } from "@/blocks/hero";
import { DailyMedia } from "@/blocks/daily-media";
import { Features } from "@/blocks/features";
import { MatchesPreview } from "@/blocks/matches-preview";
import { Pricing } from "@/blocks/pricing";
import { FAQ } from "@/blocks/faq";
import { CTA } from "@/blocks/cta";
import { Footer } from "@/blocks/footer";
import { envConfigs } from "@/config";
import { buildSeoLinks, buildSeoMeta, localizedUrl } from "@/lib/seo";
import { getWorldCupHomeFn } from "@/lib/worldcup-server";
import { m } from "@/paraglide/messages.js";
import { getLocale } from "@/paraglide/runtime.js";

/**
 * Default landing page — demo content. Rewrite this file (and the blocks in
 * src/blocks/) for your project. The primitives in src/components/ stay.
 * See /quick-start or /clone-website to automate the rewrite.
 */
function HomePage() {
  const { featuredMatches, syncStatus } = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col bg-[#edf4ed] text-slate-950">
      <Header />
      <main>
        <Hero featuredMatch={featuredMatches[0]} syncStatus={syncStatus} />
        <DailyMedia />
        <Features />
        <MatchesPreview matches={featuredMatches.slice(0, 6)} />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute('/')({
  loader: async () => {
    const locale = getLocale();
    return { locale, ...(await getWorldCupHomeFn()) };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? 'en';
    const title = envConfigs.app_name;
    const description = m['landing.hero.subheadline']({}, { locale: locale as any });
    return {
      meta: buildSeoMeta({
        title,
        description,
        path: localizedUrl('/', locale),
        keywords: 'World Cup 2026 AI prediction, World Cup score predictor, World Cup match predictions, AI football prediction',
      }),
      links: buildSeoLinks('/', locale),
    };
  },
  component: HomePage,
});
