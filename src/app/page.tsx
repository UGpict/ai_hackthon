import Link from "next/link";
import { AgentCrewStrip, LiveOpsFeed } from "@/components/agent-crew";
import { HackWedge, SerpHackMap } from "@/components/hack-wedge";
import { HoneycombPreview } from "@/components/honeycomb";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { HACK } from "@/lib/hack";
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
            <p className="rise text-xs uppercase tracking-[0.35em] text-honey">
              Steal the Pain SERP
            </p>
            <h1 className="rise rise-delay-1 mt-5 font-[family-name:var(--font-display)] text-[clamp(3.4rem,14vw,8.5rem)] leading-[0.92] tracking-tight">
              <span className="scar-underline">{SITE.name}</span>
            </h1>
            <p className="rise rise-delay-2 mt-8 max-w-xl text-lg leading-relaxed text-paper-dim sm:text-xl">
              {SITE.tagline}
              <span className="mt-3 block text-base text-paper/80 sm:text-lg">
                業務ツールじゃない。コンテンツ工場でもない。
                人が一番弱い瞬間の検索1位を、ミツバチで占領する。
              </span>
            </p>
            <div className="rise rise-delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/ops" className="cta">
                SERPを占領しにいく
              </Link>
              <Link href="#novelty" className="cta-ghost">
                新規性はどこ？
              </Link>
            </div>
          </section>

          <section
            id="novelty"
            className="border-t border-line px-5 py-20 sm:px-10"
          >
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-honey">
                  Novelty
                </p>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-snug sm:text-4xl">
                  新規性は「痛いSERPの占領マップ」
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-paper-dim sm:text-lg">
                  {HACK.novelty}
                </p>
                <p className="mt-4 max-w-xl border-l-2 border-honey pl-4 text-base leading-8 text-paper">
                  {HACK.thrill}
                </p>
              </div>
              <div className="border border-honey/40 bg-honey/5 p-6">
                <h3 className="font-[family-name:var(--font-display)] text-xl">
                  顧客がワクワクする瞬間
                </h3>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-paper-dim">
                  <li>→ 競合のまとめ記事の上に、自分の枠が刺さる</li>
                  <li>→ ハニカムが光るたびに「取った」が見える</li>
                  <li>→ ミツバチが占領部隊として動いてる感がある</li>
                  <li>→ 業務改善の進捗表ではなく、領地拡大のゲーム感</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="hack" className="border-t border-line px-5 py-20 sm:px-10">
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
                    占領部隊のミツバチ
                  </h2>
                  <p className="mt-4 max-w-2xl text-paper-dim">
                    ミツが偵察、ハニが一般論を落とし、コムが1位枠を閉じる。
                    Cuteなのは入口。やってることはSERPの略奪。
                  </p>
                </div>
                <Link href="/ops" className="text-sm text-honey hover:underline">
                  占領室へ →
                </Link>
              </div>
              <div className="mt-10">
                <AgentCrewStrip />
              </div>
              <div className="mt-10 grid gap-8 lg:grid-cols-2">
                <HoneycombPreview />
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="mb-3 text-xs tracking-[0.25em] text-paper-dim">
                      LIVE RAID
                    </h3>
                    <LiveOpsFeed />
                  </div>
                  <div className="border border-honey/30 p-6">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl">
                      光 = 占領
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-paper-dim">
                      ハニカムの光ったセルが、取るべき痛い検索枠。
                      進捗管理ではなく、領地の可視化。
                    </p>
                    <Link href="/ops" className="cta mt-8 inline-flex">
                      いま占領しにいく
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-line px-5 py-20 sm:px-10">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
                  すでに狙い始めている枠
                </h2>
                <Link href="/kizu" className="text-sm text-honey hover:underline">
                  占領一覧 →
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
                      <span className="text-sm text-paper-dim">
                        {pain.category}
                      </span>
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
