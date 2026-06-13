import { Link } from "@/core/i18n/navigation";
import { m } from "@/paraglide/messages.js";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTA() {
  
  return (
    <section className="bg-[#edf4ed] px-4 pb-20 sm:pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-emerald-950/12 bg-[#07130f] px-6 py-10 text-center text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-14">
          <h2 className="mx-auto max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
            {m["landing.cta.headline"]()}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/62 sm:text-base">
            {m["landing.cta.subheadline"]()}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/matches"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 gap-2 rounded-full bg-lime-300 px-8 text-zinc-950 hover:bg-lime-200"
              )}
            >
              {m["landing.cta.button"]()}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
