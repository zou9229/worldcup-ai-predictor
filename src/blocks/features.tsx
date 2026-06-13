import { m } from "@/paraglide/messages.js";
import { tDynamic } from "@/core/i18n/dynamic";
import {
  ShieldCheck,
  CreditCard,
  Users,
  Globe,
  FileText,
  Coins,
  type LucideIcon,
} from "lucide-react";

export function Features() {
  
  const features: { key: string; icon: LucideIcon }[] = [
    { key: "auth", icon: ShieldCheck },
    { key: "payment", icon: CreditCard },
    { key: "rbac", icon: Users },
    { key: "i18n", icon: Globe },
    { key: "cms", icon: FileText },
    { key: "credits", icon: Coins },
  ];

  return (
    <section id="features" className="bg-[#edf4ed] px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black tracking-tight text-emerald-950 sm:text-5xl">
            {m["landing.features.title"]()}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-emerald-950/62">
            {m["landing.features.description"]()}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="group relative flex flex-col gap-4 rounded-lg border border-emerald-950/12 bg-white/70 p-5 shadow-sm transition-all hover:border-emerald-900/25 hover:bg-white"
            >
              <div className="inline-flex size-10 items-center justify-center rounded-lg bg-emerald-950 text-lime-100 transition-colors group-hover:bg-lime-300 group-hover:text-emerald-950">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">{tDynamic(`landing.features.${key}.title`)}</h3>
                <p className="text-sm leading-relaxed text-emerald-950/60">
                  {tDynamic(`landing.features.${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
