"use client";

import { motion } from "framer-motion";
import { FileCheck2 } from "lucide-react";

const POINTS = [
  {
    title: "Original codebase",
    body: "Every tool, skill, workflow, theme and line of code in SpaceScript was written from scratch for this project. Nothing is copied from other mods.",
  },
  {
    title: "Original naming",
    body: "All 632 tools, 150 skills and 200 workflows use their own SpaceScript naming system — no third-party names, commands or assets ship in the package.",
  },
  {
    title: "MIT licensed",
    body: "The release is MIT licensed and ships with its full checksum manifest, so anyone can verify and audit what they download.",
  },
];

export function Credits() {
  return (
    <section id="credits" aria-label="Originality and licensing" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            05 — Original by design
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Renamed, reworked, original.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            SpaceScript is an independent project inspired by the script-mod
            ecosystem, not a copy of any of it.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {POINTS.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-amber-600 dark:text-amber-400">
                <FileCheck2 className="h-4 w-4" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-semibold tracking-tight">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {point.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
