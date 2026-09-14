import Link from "next/link";
import { AgentCrewStrip, LiveOpsFeed } from "@/components/agent-crew";
import { HackWedge, SerpHackMap } from "@/components/hack-wedge";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { pains } from "@/lib/pains";
import { SITE } from "@/lib/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "ja-JP",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/kizu?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="hero-wash relative flex min-h-full flex-1 flex-col">
        <SiteHeader />

        <main className="relative z-10 flex flex-1 flex-col">
          <section className="scratch-panel relative mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-10 sm:px-10 sm:pb-24">
            <p className="rise text-xs uppercase tracking-[0.35em] text-scar">
              Hack one SERP niche
            </p>
            <h1 className="rise rise-delay-1 mt-5 font-[family-name:var(--font-display)] text-[clamp(3.4rem,14vw,8.5rem)] leading-[0.92] tracking-tight">
              <span className="scar-underline">{SITE.name}</span>
            </h1>
            <p className="rise rise-delay-2 mt-8 max-w-xl text-lg leading-relaxed text-paper-dim sm:text-xl">
              {SITE.tagline}
              <span className="mt-3 block text-base text-paper/80 sm:text-lg">
                業務改善しない。コンテンツ全般もやらない。痛い検索語だけを取る。
              </span>
            </p>
            <div className="rise rise-delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/ops" className="cta">
                ハックを回す
              </Link>
              <Link href="#hack" className="cta-ghost">
                何をハックするか
              </Link>
            </div>
          </section>

          <section
            id="hack"
            className="border-t border-line px-5 py-20 sm:px-10"
          >
            <div className="mx-auto max-w-6xl">
              <HackWedge />
              <div className="mt-12">
                <SerpHackMap />
              </div>
            </div>
          </section>

          <section
            id="crew"
            className="border-t border-line bg-ink-soft/40 px-5 py-20 sm:px-10"
          >
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
                    ハックを回す三人
                  </h2>
                  <p className="mt-4 max-w-2xl text-paper-dim">
                    強みは「痛いにだけ特化したSEO運用」そのもの。キャラは、自分たちのためにSERPを削り続けてる感を可視化するための装置。
                  </p>
                </div>
                <Link href="/ops" className="text-sm text-scar hover:underline">
                  ハック室へ →
                </Link>
              </div>
              <div className="mt-10">
                <AgentCrewStrip />
              </div>
              <div className="mt-10 grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-xs tracking-[0.25em] text-paper-dim">
                    LIVE HACK LOG
                  </h3>
                  <LiveOpsFeed />
                </div>
                <div className="flex flex-col justify-between border border-line p-6">
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl">
                      型を固定したから速い
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-paper-dim">
                      なぜ今 / 先に痛い事実 / 分岐点 / 今夜の一手。この外に出ない。汎用ライターAIに勝てる理由は、捨てた範囲の広さ。
                    </p>
                  </div>
                  <Link href="/ops" className="cta mt-8 w-fit">
                    痛い語でハックを起動
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section id="how" className="border-t border-line px-5 py-20 sm:px-10">
            <div className="mx-auto max-w-6xl">
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
                取るページの型（これ以外は作らない）
              </h2>
              <p className="mt-4 max-w-2xl text-paper-dim">
                1クエリ = 1きずあと。量産してもSEOが崩れないのは、骨格を変えないから。
              </p>
              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["なぜ今", "この語で検索する瞬間の心理"],
                  ["先に痛い事実", "原体験の塊を薄めた観察"],
                  ["分岐点", "前に戻れたら変えられた選択"],
                  ["次の一手", "今夜やることだけ"],
                ].map(([title, body]) => (
                  <div key={title} className="border-t border-scar/50 pt-4">
                    <h3 className="font-[family-name:var(--font-display)] text-xl">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-paper-dim">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-line px-5 py-20 sm:px-10">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
                  いま奪いにいってるクエリ
                </h2>
                <Link href="/kizu" className="text-sm text-scar hover:underline">
                  索引を見る →
                </Link>
              </div>
              <ul className="mt-10 divide-y divide-line border-y border-line">
                {pains.slice(0, 6).map((pain) => (
                  <li key={pain.slug}>
                    <Link
                      href={`/kizu/${pain.slug}`}
                      className="pain-link flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between"
                    >
                      <span className="text-lg sm:text-xl">{pain.query}</span>
                      <span className="text-sm text-paper-dim">{pain.category}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
