"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Box, Gamepad2, Terminal } from "lucide-react";
import { STATS } from "@/lib/spacescript/meta";

const BLENDER_HIGHLIGHTS = [
  "Mesh Works, Sculpt Room, Shader Lab, Light Rig",
  "Geometry Nodes, Rig Craft, Motion Deck, Render Bay",
  "FBX / glTF / USD export with scale and pivot healing",
  "Procedural city blocks, terrain and scatter fields",
];

const ROBLOX_HIGHLIGHTS = [
  "Explorer Ops, Luau Forge, UI Studio, Terrain Kit",
  "Game Systems, Audio Stage, Physics Lab, Animation Deck",
  "Typed Luau generation with server-trust discipline",
  "Place diffs, session snapshots and live output taps",
];

const CORE_HIGHLIGHTS = [
  "18 AI providers with local key storage",
  "Studio Canvas graphs, 188 menu commands, Ctrl+K palette",
  `Project memory, knowledge base and ${STATS.workflows} workflows`,
  "Electron-packed desktop app, SHA-256 verified, offline-first",
];

interface IntegrationCardProps {
  icon: React.ReactNode;
  name: string;
  toolLabel: string;
  count: number;
  highlights: string[];
  href: string;
  delay?: number;
}

function IntegrationCard({
  icon,
  name,
  toolLabel,
  count,
  highlights,
  href,
  delay = 0,
}: IntegrationCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay }}
      className="group flex min-w-0 flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-amber-500/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:p-7"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground transition-colors group-hover:border-amber-500/40 group-hover:text-amber-600 dark:group-hover:text-amber-400">
            {icon}
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-tight">{name}</h3>
            <p className="font-mono text-[11px] text-muted-foreground">
              {count} {toolLabel}
            </p>
          </div>
        </div>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
      <ul className="mt-5 flex flex-1 flex-col gap-2.5">
        {highlights.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
          >
            <span
              className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-500"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </motion.a>
  );
}

export function FeatureGrid() {
  return (
    <section
      id="integrations"
      aria-label="Engine integrations"
      className="scroll-mt-20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            01 — Integrations
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built around two engines
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Deep, first-class bridges for the two tools you actually live in.
            Every category is polished end to end — this is where the{" "}
            {STATS.tools} tools live.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <IntegrationCard
            icon={<Box className="h-5 w-5" aria-hidden="true" />}
            name="Blender"
            toolLabel="tools"
            count={STATS.engines.blender}
            highlights={BLENDER_HIGHLIGHTS}
            href="#studio"
          />
          <IntegrationCard
            icon={<Gamepad2 className="h-5 w-5" aria-hidden="true" />}
            name="Roblox Studio"
            toolLabel="tools"
            count={STATS.engines.roblox}
            highlights={ROBLOX_HIGHLIGHTS}
            href="#studio"
            delay={0.06}
          />
          <IntegrationCard
            icon={<Terminal className="h-5 w-5" aria-hidden="true" />}
            name="Core bus"
            toolLabel="core tools"
            count={STATS.engines.core}
            highlights={CORE_HIGHLIGHTS}
            href="#studio"
            delay={0.12}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-6 font-mono text-[11px] text-muted-foreground"
        >
          Windows only for now — macOS and Linux builds come after the two
          engines are flawless.
        </motion.p>
      </div>
    </section>
  );
}
