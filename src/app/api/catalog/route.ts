import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  CHANGELOG,
  COMMANDS,
  IDEAS,
  PROVIDERS,
  SKILL_PACKS,
  THEMES,
  TOOLS,
  WORKFLOWS,
} from "@/lib/spacescript/data";

export const dynamic = "force-dynamic";

/**
 * GET /api/catalog
 * Serves the SpaceScript catalog from SQLite. Falls back to the
 * bundled canonical data if the database is empty or unreachable,
 * so the site always renders.
 */
export async function GET() {
  try {
    const [providerRows, toolRows, skillRows, workflowRows, themeRows, ideaRows, commandRows, releaseRows] =
      await Promise.all([
        db.provider.findMany({ orderBy: { sortOrder: "asc" } }),
        db.tool.findMany({ orderBy: { sortOrder: "asc" } }),
        db.skillPack.findMany({ orderBy: { sortOrder: "asc" } }),
        db.workflow.findMany({ orderBy: { sortOrder: "asc" } }),
        db.themePreset.findMany({ orderBy: { sortOrder: "asc" } }),
        db.idea.findMany({ orderBy: { sortOrder: "asc" } }),
        db.commandEntry.findMany({ orderBy: { sortOrder: "asc" } }),
        db.changelogRelease.findMany({ orderBy: { sortOrder: "asc" } }),
      ]);

    if (
      providerRows.length === 0 ||
      toolRows.length === 0 ||
      skillRows.length === 0
    ) {
      throw new Error("catalog tables are empty");
    }

    return NextResponse.json({
      providers: providerRows.map((p) => ({
        id: p.id,
        name: p.name,
        url: p.url,
        apiBase: p.apiBase,
        status: p.status,
        notes: p.notes,
        accent: p.accent,
        vision: p.vision,
        local: p.local,
        keyHint: p.keyHint,
      })),
      tools: toolRows.map((t) => ({
        id: t.id,
        name: t.name,
        engine: t.engine,
        category: t.category,
        description: t.description,
        syntax: t.syntax,
        params: safeParse(t.params, []),
        safeModeOnly: t.safeModeOnly,
      })),
      skills: skillRows.map((s) => ({
        id: s.id,
        name: s.name,
        family: s.family,
        version: s.version,
        description: s.description,
        toolCount: s.toolCount,
        tags: safeParse(s.tags, []),
        steps: safeParse(s.steps, []),
      })),
      workflows: workflowRows.map((w) => ({
        id: w.id,
        name: w.name,
        category: w.category,
        description: w.description,
        steps: w.steps,
        difficulty: w.difficulty,
        runs: w.runs,
      })),
      themes: themeRows.map((t) => ({
        id: t.id,
        name: t.name,
        mood: t.mood,
        colors: safeParse(t.colors, {}),
      })),
      ideas: ideaRows.map((i) => ({
        id: i.id,
        title: i.title,
        tagline: i.tagline,
        category: i.category,
        difficulty: i.difficulty,
        status: i.status,
      })),
      commands: commandRows.map((c) => ({
        id: c.id,
        label: c.label,
        menu: c.menu,
        accelerator: c.accelerator,
        description: c.description,
        dynamic: c.dynamic,
      })),
      changelog: releaseRows.map((r) => ({
        version: r.id,
        codename: r.codename,
        date: r.date,
        headline: r.headline,
        items: safeParse(r.items, []),
      })),
      source: "database",
    });
  } catch {
    return NextResponse.json({
      providers: PROVIDERS,
      tools: TOOLS,
      skills: SKILL_PACKS,
      workflows: WORKFLOWS,
      themes: THEMES,
      ideas: IDEAS,
      commands: COMMANDS,
      changelog: CHANGELOG,
      source: "bundled",
    });
  }
}

function safeParse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
