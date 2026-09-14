import type { Metadata } from "next";
import { AgentCrewStrip } from "@/components/agent-crew";
import { AgentRunner } from "@/components/agent-runner";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { agents } from "@/lib/agents";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "エージェント稼働室",
  description:
    "サグリ・ケズリ・トジが、痛い検索語のSEOページをあなたの代わりに掘り、削り、閉じる。働いてくれてる感を可視化するオペ室。",
  alternates: {
    canonical: `${SITE.url}/ops`,
  },
};

export default function OpsPage() {
  return (
    <div className="hero-wash relative flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-scar">Ops</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          エージェント稼働室
        </h1>
        <p className="mt-4 max-w-2xl text-paper-dim leading-relaxed">
          きずあとの強みは、痛いに特化したSEOを、キャラ付きエージェントが止めずに回すこと。
          業務改善ではなく、検索結果の一点突破をハックする。
        </p>

        <section className="mt-12">
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-2xl">
            いま、あなたのために働いてる三人
          </h2>
          <AgentCrewStrip />
          <ul className="mt-6 grid gap-3 text-sm text-paper-dim sm:grid-cols-3">
            {agents.map((a) => (
              <li key={a.id} className="border-t border-line pt-3">
                <span className="text-paper">{a.name}</span> — {a.workingForYou}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-line pt-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
            痛い検索語を投げて、働かせる
          </h2>
          <p className="mt-3 max-w-2xl text-paper-dim">
            入力した語のために、三人の手が順番に動く。成果はきずあと下書き。
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
