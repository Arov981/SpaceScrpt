import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ReleaseManifest {
  version: string;
  codename: string;
  buildDate: string;
  electronVersion: string;
  zip: { fileName: string; size: number; sha256: string; url: string };
  portable: { fileName: string; size: number; sha256: string; url: string };
  builder?: {
    fileName: string;
    size: number;
    lines: number;
    sha256: string;
    url: string;
  };
  counts: Record<string, number | string>;
}

const MANIFEST_PATH = path.join(
  process.cwd(),
  "public",
  "downloads",
  "manifest.json",
);

let cachedManifest: ReleaseManifest | null = null;
let cachedManifestMtime = 0;

async function getManifest(): Promise<ReleaseManifest | null> {
  try {
    const stats = await stat(MANIFEST_PATH);
    if (cachedManifest && stats.mtimeMs === cachedManifestMtime) {
      return cachedManifest;
    }
    const raw = await readFile(MANIFEST_PATH, "utf-8");
    cachedManifest = JSON.parse(raw) as ReleaseManifest;
    cachedManifestMtime = stats.mtimeMs;
    return cachedManifest;
  } catch {
    return null;
  }
}

async function getWindowsCount(): Promise<number> {
  try {
    const row = await db.downloadStat.findUnique({ where: { platform: "windows" } });
    return row?.count ?? 0;
  } catch {
    return 0;
  }
}

/**
 * GET /api/download
 * Release metadata straight from the build manifest: version, size,
 * sha256, portable lite info and the running download counter.
 */
export async function GET() {
  const [manifest, windows] = await Promise.all([getManifest(), getWindowsCount()]);

  if (!manifest) {
    return NextResponse.json(
      { error: "Release manifest not built yet. Run scripts/build_spacescript.py." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    version: manifest.version,
    codename: manifest.codename,
    buildDate: manifest.buildDate,
    electronVersion: manifest.electronVersion,
    fileName: manifest.zip.fileName,
    size: manifest.zip.size,
    sha256: manifest.zip.sha256,
    url: manifest.zip.url,
    downloads: windows,
    breakdown: { windows },
    portable: {
      fileName: manifest.portable.fileName,
      size: manifest.portable.size,
      sha256: manifest.portable.sha256,
      url: manifest.portable.url,
    },
    builder: manifest.builder
      ? {
          fileName: manifest.builder.fileName,
          size: manifest.builder.size,
          lines: manifest.builder.lines,
          sha256: manifest.builder.sha256,
          url: manifest.builder.url,
        }
      : null,
    counts: manifest.counts,
  });
}

/**
 * POST /api/download { platform: "windows" }
 * Increments the download counter (upsert, no losses on races that matter).
 */
export async function POST(request: NextRequest) {
  let platform = "windows";
  try {
    const body = (await request.json()) as { platform?: string };
    if (typeof body.platform === "string" && body.platform.length > 0) {
      platform = body.platform.slice(0, 32);
    }
  } catch {
    // keep default platform
  }

  try {
    const existing = await db.downloadStat.findUnique({
      where: { platform },
    });

    const row = existing
      ? await db.downloadStat.update({
          where: { platform },
          data: { count: { increment: 1 } },
        })
      : await db.downloadStat.create({ data: { platform, count: 1 } });

    const windows = platform === "windows" ? row.count : await getWindowsCount();

    return NextResponse.json({
      success: true,
      platform,
      downloads: windows,
      breakdown: { windows },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Counter unavailable." },
      { status: 500 },
    );
  }
}
