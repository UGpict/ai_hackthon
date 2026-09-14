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
    "ミツ・ハニ・コムが痛い検索語の蜜をハニカムへ運び、良さげなセルだけ光らせる。Cuteに見せて、中身はPain SERPハック。",
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
          Bee hack console
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          ハニカム・ハック室
        </h1>
        <p className="mt-4 max-w-2xl text-paper-dim leading-relaxed">
          {HACK.oneLiner}
          ミツバチがアイデアをセルに運び、光ったものだけが残る。可愛い顔して、捨てる基準は厳しい。
        </p>

        <section className="mt-10">
          <SerpHackMap />
        </section>

        <section className="mt-12">
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-2xl">
            出動メンバー
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
            痛い検索語の蜜を、ハニカムへ
          </h2>
          <p className="mt-3 max-w-2xl text-paper-dim">
            入力した語だけを運ぶ。光ったセルが、きずあと下書きになる。
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
