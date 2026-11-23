"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATS, VERSION_INFO } from "@/lib/spacescript/meta";

function StatCell({ value, label, last }: { value: number; label: string; last?: boolean }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Respect reduced-motion: jump straight to the final value instead
      // of animating. setState-in-effect is intentional here (one-shot
      // terminal value when the user has opted out of animation).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-1 px-5 py-4 sm:px-8 ${last ? "" : "border-border sm:border-r"}`}
    >
      <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
        {display.toLocaleString()}
        <span className="text-amber-500 dark:text-amber-400">+</span>
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  const cells: { value: number; label: string }[] = [
    { value: STATS.tools, label: "Tools" },
    { value: STATS.skills, label: "Skills" },
    { value: STATS.presets, label: "Canvas presets" },
    { value: STATS.menuCommands, label: "Commands" },
    { value: STATS.themes, label: "Themes" },
  ];

  return (
    <section
      id="overview"
      aria-label="SpaceScript overview"
      className="relative overflow-hidden"
    >
      {/* Subtle dotted grid backdrop */}
      <div className="dot-grid absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Windows build · v{VERSION_INFO.version} “{VERSION_INFO.codename}” · Electron packed
          </p>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Make AIs
            <br />
            <span className="text-muted-foreground">work</span>{" "}
            <span className="text-amber-500 dark:text-amber-400">together</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            SpaceScript is the AI desk for{" "}
            <span className="font-medium text-foreground">Blender</span> and{" "}
            <span className="font-medium text-foreground">Roblox Studio</span>.{" "}
            Cowork Mode seats multiple AIs in one chat, BYOK wires{" "}
            {STATS.providers} providers — Ollama and NVIDIA NIM included — and
            your phone becomes a side command center.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-6 text-[15px] font-medium">
              <a href="#download">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download for Windows
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 px-6 text-[15px] font-medium"
            >
              <a href="#studio">
                Explore the studio
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
          <p className="mt-5 font-mono text-[11px] text-muted-foreground">
            No installer · no account · runs offline · MIT licensed
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
            {["Cowork Mode", "BYOK", "Atlas Vault", "Side Command"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] text-muted-foreground"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="grid grid-cols-2 divide-border rounded-xl border border-border bg-card sm:grid-cols-5 sm:divide-x sm:rounded-lg [&>*:nth-child(-n+2)]:border-b sm:[&>*:nth-child(-n+2)]:border-b-0 [&>*:nth-child(odd)]:border-r sm:[&>*:nth-child(odd)]:border-r-0">
            {cells.map((cell, i) => (
              <StatCell
                key={cell.label}
                value={cell.value}
                label={cell.label}
                last={i === cells.length - 1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
