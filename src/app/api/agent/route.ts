import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import type { ChatMessage } from "@/lib/spacescript/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface AgentBody {
  messages?: ChatMessage[];
  target?: string;
}

/* ------------------------------------------------------------------ */
/* Simple in-memory rate limit: 20 requests / minute / IP             */
/* ------------------------------------------------------------------ */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

/* ------------------------------------------------------------------ */
/* System prompt — the SpaceScript mission specialist                  */
/* ------------------------------------------------------------------ */
const ROBLOX_CHEAT_SHEET = `
Inspect: ss x.grove-lens --root Workspace --limit 700 | ss x.twig-probe --path Workspace/Part | ss x.prop-sheet --path Workspace/Part | ss x.kin-seeker --match Coin* --class Part
Edit: ss x.seed-planter --name Platform --size 8 | ss x.prop-patch --path Workspace/Part --properties {Anchored=true} | ss x.fold-group --match Coin* --name Loot | ss x.grid-seeder --source Coin --rows 4 --cols 4 --spacing 6
Scripts: ss luau.scroll-read --path ServerScriptService/Main | ss luau.scroll-write --path ServerScriptService/Main --text <luau> | ss luau.scroll-binder --name Main --parent ServerScriptService
Systems: ss game.currency-vault --name Coins | ss game.quest-board --name Chapter1 | ss studio.place-pulse
Tags: ss x.stamp-tag --match Workspace/NPC --tag Enemy | ss x.tag-herald --tag Enemy --limit 50`;

const BLENDER_CHEAT_SHEET = `
Scene: ss io.scene-ledger | ss io.scene-diff-echo | ss mesh.mesh-probe --source Building_01
Create: ss io.city-grid-smith --count 5 --seed 7 | ss io.terrain-slab --size 32 --seed 11 | ss gn.scatter-distributor --source Rock --count 40 --seed 3
Mesh: ss mesh.bevel-wright --source Hull --strength 0.6 | ss mesh.uv-packer --source Hull | ss mesh.retopo-loom --source Sculpt
Materials: ss shade.principled-smith --name Hull | ss shade.metal-polish --name Trim --preset chrome | ss shade.baking-oven --source Hull --file D:/bakes/hull.png
Camera/Light: ss rend.camera-wright --preset 35mm | ss light.sun-dial --strength 3 --color 255,244,214
Render/Export: ss rend.render-queue --count 1 | ss io.save-vault --note ship-v2 | ss io.fbx-export --file D:/exports/ship.fbx`;

function buildSystemPrompt(target: string): string {
  const engine =
    target === "blender"
      ? `You are planning for BLENDER (3.6+). Generated code is Python using the bpy API, executed by the SpaceScript Blender addon. Every bpy snippet must be safe to run headless: never call bpy.ops.wm.quit, never touch the filesystem outside render/export helpers, prefer data API (bpy.data) over operators when possible.`
      : `You are planning for ROBLOX STUDIO. Generated code is Luau. Prefer typed, idiomatic Luau, services via game:GetService, and place scripts where they belong (Script in ServerScriptService, LocalScript in StarterPlayerScripts, ModuleScript in ReplicatedStorage).`;

  return [
    "You are SpaceScript's onboard mission specialist: a senior game-dev agent that plans and executes missions in Roblox Studio and Blender through the StarBridge local tool bus.",
    engine,
    "",
    "RULES:",
    "1. Answer in compact Markdown. Start with a one-line mission summary.",
    "2. Then a numbered plan (max 6 steps). For each step name the exact SpaceScript tool command in backticks (they all start with `ss `).",
    "3. When code is needed, include ONE fenced code block (```lua for Roblox, ```python for Blender) with complete, runnable code and short comments. Keep code under 80 lines.",
    "4. Use only tools from the cheat sheet below. Never invent tool names.",
    "5. Mention safe-mode limits when a tool is flagged safe-mode-only (ss run_server_luau / ss run_client_luau) and offer the staged-script alternative instead.",
    "6. Close with a one-line next-step suggestion.",
    "7. Never claim to have executed anything: you propose, the human runs the commands in SpaceScript Studio.",
    "",
    target === "blender"
      ? `TOOL CHEAT SHEET (Blender):${BLENDER_CHEAT_SHEET}`
      : `TOOL CHEAT SHEET (Roblox):${ROBLOX_CHEAT_SHEET}`,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* POST /api/agent                                                     */
/* ------------------------------------------------------------------ */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many missions too fast — cool down a moment." },
      { status: 429 },
    );
  }

  let body: AgentBody;
  try {
    body = (await request.json()) as AgentBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Malformed request body." },
      { status: 400 },
    );
  }

  const target = body.target === "blender" ? "blender" : "roblox";
  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const history = incoming
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 6_000) }));

  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json(
      { success: false, error: "No mission objective found in the message list." },
      { status: 400 },
    );
  }

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: buildSystemPrompt(target) },
        ...history,
      ],
      thinking: { type: "disabled" },
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error("empty completion");
    }

    // Best-effort analytics — never fail the request over this.
    void db.agentRun
      .create({ data: { target, prompt: lastUser.content.slice(0, 2_000) } })
      .catch(() => undefined);

    return NextResponse.json({ success: true, reply, target });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "unknown agent failure";
    console.error("[api/agent] failed:", message);
    return NextResponse.json(
      {
        success: false,
        error: "The agent uplink dropped mid-mission. Try again in a moment.",
      },
      { status: 502 },
    );
  }
}
