import type { Metadata } from "next";
import { AgentCrewStrip } from "@/components/agent-crew";
import { AgentRunner } from "@/components/agent-runner";
import { SerpHackMap } from "@/components/hack-wedge";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { agents } from "@/lib/agents";
import { HACK } from "@/lib/hack";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "SERP占領室",
  description:
    "痛い検索語を入れて、ミツバチが競合SERPの上を取りにいく。ハニカムの光＝占領した枠。",
  alternates: {
    canonical: `${SITE.url}/ops`,
  },
};

export default function OpsPage() {
  return (
    <div className="hero-wash relative flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-honey">
          SERP occupation console
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          SERP占領室
        </h1>
        <p className="mt-4 max-w-2xl text-paper-dim leading-relaxed">
          {HACK.oneLiner}
          仕事ログの整理室ではない。競合の一般論の上を取る、占領の司令室。
        </p>

        <section className="mt-10">
          <SerpHackMap />
        </section>

        <section className="mt-12">
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-2xl">
            占領部隊
          </h2>
          <AgentCrewStrip />
          <ul className="mt-6 grid gap-3 text-sm text-paper-dim sm:grid-cols-3">
            {agents.map((a) => (
              <li key={a.id} className="border-t border-honey/30 pt-3">
                <span className="text-paper">{a.name}</span> — {a.workingForYou}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-line pt-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
            痛い検索語を入れて、1位を取りにいく
          </h2>
          <p className="mt-3 max-w-2xl text-paper-dim">
            左に競合SERP、右にハニカム。光った瞬間が占領。そこがワクワクの本体。
          </p>
          <div className="mt-8">
            <AgentRunner initialQuery="転職して後悔した" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
