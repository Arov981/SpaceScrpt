"use client";

import Image from "next/image";

const SECTION_LINKS = [
  { label: "Overview", href: "#overview" },
  { label: "Integrations", href: "#integrations" },
  { label: "Studio", href: "#studio" },
  { label: "Agent", href: "#agent" },
  { label: "Download", href: "#download" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <a
            href="#overview"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            aria-label="Back to top"
          >
            <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md border border-border bg-card">
              <Image
                src="/spacescript-mark.svg"
                alt="SpaceScript mark"
                width={28}
                height={28}
                className="h-full w-full object-contain"
              />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              SpaceScript
            </span>
          </a>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © 2026 SpaceScript Contributors · MIT · All code original.
            Not affiliated with Roblox Corporation or the Blender Foundation.
          </p>
          <p className="font-mono">Windows 10/11 · Roblox Studio · Blender 3.6+</p>
        </div>
      </div>
    </footer>
  );
}
