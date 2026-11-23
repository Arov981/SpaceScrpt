import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The site is served through the Caddy gateway on :81 which proxies to
  // this dev server on :3000. Next.js 16 blocks cross-origin requests to dev
  // resources (HMR WebSocket, next/font google dev endpoints) unless the
  // origin is explicitly allow-listed. Without this, the HMR client throws
  // during bootstrap and React never hydrates — the page renders as static
  // server HTML with zero interactivity (tabs don't switch, effects don't
  // run, fetches inside useEffect never fire).
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "127.0.0.1:81",
    "localhost:81",
    "127.0.0.1:3000",
    "localhost:3000",
    // The site is also viewed through the chat.z.ai preview panel, which
    // proxies through the gateway under a few possible hostnames. Allow
    // them all so the HMR WebSocket + next/font dev endpoints aren't
    // blocked, which would silently abort client hydration and leave the
    // page rendered as static HTML (content trapped at opacity:0).
    "chat.z.ai",
    "www.chat.z.ai",
    "0.0.0.0",
    "0.0.0.0:81",
  ],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
