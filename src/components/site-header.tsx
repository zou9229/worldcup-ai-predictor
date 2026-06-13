"use client";

import { m } from "@/paraglide/messages.js";
import { Link } from "@/core/i18n/navigation";
import { ArrowRight, Menu, Trophy, X } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSelector } from "@/components/locale-selector";
import { SiteUserMenu } from "@/components/site-user-menu";
import { useSession } from "@/core/auth/client";
import { cn } from "@/lib/utils";
import { envConfigs } from "@/config";

export interface NavLink {
  href: string;
  label: string;
  /** Open in a new tab. Off-site (http) hrefs always open in a new tab. */
  external?: boolean;
}

/** Off-site URLs render as plain <a>; internal paths use the locale-aware Link. */
const isExternalHref = (href: string) => /^https?:\/\//.test(href);

export function SiteHeader({
  navLinks,
}: {
  navLinks?: NavLink[];
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#07130f]/92 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full border border-lime-200/25 bg-lime-200/10 text-lime-100">
            <Trophy className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-black uppercase tracking-[0.16em]">{envConfigs.app_name}</span>
            <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/42">AI match desk</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks?.map((link) =>
            isExternalHref(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white/58 transition-colors hover:text-lime-100"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className="text-sm font-semibold text-white/58 transition-colors hover:text-lime-100"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LocaleSelector className="text-white/68 hover:bg-white/10 hover:text-white" />
          <div className="text-white/68">
            <ThemeToggle />
          </div>
          {user ? (
            <SiteUserMenu
              name={user.name || "User"}
              email={user.email}
              image={user.image}
            />
          ) : (
            <Link
              href="/settings"
              className={cn(
                buttonVariants(),
                "gap-1.5 rounded-full bg-lime-300 font-semibold text-zinc-950 hover:bg-lime-200"
              )}
            >
              {m["common.nav.get_started"]()}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-md p-2 text-white/80 hover:bg-white/10 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#07130f] px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks?.map((link) =>
              isExternalHref(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-3 py-2 text-sm text-white/62 transition-colors hover:bg-white/10 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  className="rounded-md px-3 py-2 text-sm text-white/62 transition-colors hover:bg-white/10 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
            <LocaleSelector className="text-white/68 hover:bg-white/10 hover:text-white" />
            <div className="text-white/68">
              <ThemeToggle />
            </div>
            <div className="flex-1" />
            {user ? (
              <SiteUserMenu
                name={user.name || "User"}
                email={user.email}
                image={user.image}
              />
            ) : (
              <Link
                href="/settings"
                className={cn(
                  buttonVariants(),
                  "gap-1.5 rounded-full bg-lime-300 text-zinc-950 hover:bg-lime-200"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {m["common.nav.get_started"]()}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
