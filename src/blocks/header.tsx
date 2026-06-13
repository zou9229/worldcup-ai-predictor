import { SiteHeader } from "@/components/site-header";
import { m } from "@/paraglide/messages.js";

export function Header() {
  
  const navLinks = [
    { href: "/matches", label: m["worldcup.nav.matches"]() },
    { href: "/watch", label: m["worldcup.nav.watch"]() },
    { href: "/score-simulator", label: m["worldcup.nav.simulator"]() },
    { href: "/pricing", label: m["landing.nav.pricing"]() },
  ];

  return <SiteHeader navLinks={navLinks} />;
}
