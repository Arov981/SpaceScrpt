import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpaceScript — Multi-AI Studio for Blender + Roblox Studio",
  description:
    "SpaceScript v3.0.0 Constellation: Cowork Mode seats multiple AIs in one shared chat, BYOK wires 29 providers (Ollama, NVIDIA NIM included) with OS-sealed keys, the Atlas Vault keeps wiki-linked markdown notes, and your phone becomes a PIN-paired side command center. 632 tools, 240 skills, 238 commands, full Electron runtime packed. Windows-first, no installer, no telemetry.",
  keywords: [
    "SpaceScript",
    "Cowork Mode",
    "multi-agent AI",
    "BYOK",
    "Ollama",
    "NVIDIA NIM",
    "Atlas Vault",
    "side command center",
    "AI agent",
    "Roblox Studio",
    "Blender",
    "StarBridge",
    "Luau",
    "AI coding assistant",
    "game development",
    "Electron studio",
    "Studio Canvas",
  ],
  authors: [{ name: "SpaceScript Contributors" }],
  icons: {
    icon: "/spacescript-mark.svg",
  },
  openGraph: {
    title: "SpaceScript — Multi-AI Studio for Blender + Roblox Studio",
    description:
      "Cowork Mode, BYOK with 29 providers, the Atlas Vault and a phone-side command center. 632 tools, 240 skills, 238 commands. Deep Blender and Roblox Studio bridges. No installer. No account. Your PC, your engine, your agents.",
    siteName: "SpaceScript",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpaceScript — Multi-AI Studio for Blender + Roblox Studio",
    description:
      "Make AIs work together: Cowork Mode, BYOK (Ollama + NVIDIA NIM), Atlas Vault and the Side Command Center in an Electron-packed desktop app for Windows.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
