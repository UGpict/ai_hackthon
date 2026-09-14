import type { Metadata } from "next";
import { AgentCrewStrip } from "@/components/agent-crew";
import { AgentRunner } from "@/components/agent-runner";
import { SerpHackMap } from "@/components/hack-wedge";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { agents } from "@/lib/agents";
import { HACK } from "@/lib/hack";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "ハニカム・ハック室",
  description:
    "仕事ログから顧客の痛み言葉を抽出し、人が採用したセルだけをハニカムで光らせる。Cuteな顔、厳しい拒否ルール。",
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
          Work-log → pain SERP
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          ハニカム・ハック室
        </h1>
        <p className="mt-4 max-w-2xl text-paper-dim leading-relaxed">
          {HACK.oneLiner}
          原料はキーワード想像ではなく、自分の仕事ログ。拒否はスライドではなくコード。
        </p>

        <section className="mt-10">
          <SerpHackMap />
        </section>

        <section className="mt-12">
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-2xl">
            出動メンバー（進捗の顔）
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
            仕事ログから、痛み言葉を抜く
          </h2>
          <p className="mt-3 max-w-2xl text-paper-dim">
            貼る → 規則で抽出 → 人が採用 → 光ったセルだけ下書き。手打ちキーワードは本体ではない。
          </p>
          <div className="mt-8">
            <AgentRunner />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
