import { m } from "@/paraglide/messages.js";
import { tDynamic } from "@/core/i18n/dynamic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_KEYS = ["stack", "payment", "database", "customize", "license"] as const;

export function FAQ() {
  
  return (
    <section id="faq" className="bg-[#edf4ed] px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black tracking-tight text-emerald-950 sm:text-5xl">
            {m["landing.faq.title"]()}
          </h2>
          <p className="mt-4 text-sm text-emerald-950/62">
            {m["landing.faq.description"]()}
          </p>
        </div>
        <Accordion className="w-full rounded-lg border border-emerald-950/10 bg-white/70 px-5 shadow-sm">
          {FAQ_KEYS.map((key) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="cursor-pointer py-6 text-left text-base font-medium hover:no-underline">
                {tDynamic(`landing.faq.${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="pb-6 leading-relaxed text-emerald-950/62">
                {tDynamic(`landing.faq.${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
