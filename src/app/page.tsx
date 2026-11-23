import { Navbar } from "@/components/spacescript/navbar";
import { Hero } from "@/components/spacescript/hero";
import { FeatureGrid } from "@/components/spacescript/feature-grid";
import { Studio } from "@/components/spacescript/studio";
import { AgentDemo } from "@/components/spacescript/agent-demo";
import { Downloads } from "@/components/spacescript/downloads";
import { CommandsSection } from "@/components/spacescript/commands-section";
import { ChangelogSection } from "@/components/spacescript/changelog-section";
import { Credits } from "@/components/spacescript/credits";
import { Footer } from "@/components/spacescript/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeatureGrid />
        <Studio />
        <AgentDemo />
        <Downloads />
        <CommandsSection />
        <ChangelogSection />
        <Credits />
      </main>
      <Footer />
    </div>
  );
}
