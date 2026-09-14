import Link from "next/link";
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
              SEO for lived pain
            </p>
            <h1 className="rise rise-delay-1 mt-5 font-[family-name:var(--font-display)] text-[clamp(3.4rem,14vw,8.5rem)] leading-[0.92] tracking-tight">
              <span className="scar-underline">{SITE.name}</span>
            </h1>
            <p className="rise rise-delay-2 mt-8 max-w-xl text-lg leading-relaxed text-paper-dim sm:text-xl">
              {SITE.tagline}
              <span className="mt-3 block text-base text-paper/80 sm:text-lg">
                原体験の塊みたいな辛さを、自分が全部背負う前に薄める。
              </span>
            </p>
            <div className="rise rise-delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/kizu" className="cta">
                痛い検索語から入る
              </Link>
              <Link href="#thesis" className="cta-ghost">
                なぜSEOなのか
              </Link>
            </div>
          </section>

          <section
            id="thesis"
            className="border-t border-line px-5 py-20 sm:px-10"
          >
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-3xl leading-snug sm:text-4xl">
                  人は、痛い瞬間にしか本気で検索しない。
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-paper-dim sm:text-lg">
                  きずあとは、その検索意図のど真ん中に「先に痛い事実」を置く。
                  ブログでもSNSでもなく、原体験を圧縮したページを、検索結果の入口にする。
                </p>
              </div>
              <ol className="space-y-5 border-l border-line pl-6 text-sm leading-7 text-paper-dim sm:text-base">
                <li>
                  <span className="text-scar">01</span>{" "}
                  深夜の検索語＝今まさに原体験が固まりかけている合図
                </li>
                <li>
                  <span className="text-scar">02</span>{" "}
                  そこで届くのは精神論ではなく、分岐点と次の一手
                </li>
                <li>
                  <span className="text-scar">03</span>{" "}
                  痛みのページを量産し、内部リンクで関連する傷をつなぐ
                </li>
              </ol>
            </div>
          </section>

          <section id="how" className="border-t border-line bg-ink-soft/40 px-5 py-20 sm:px-10">
            <div className="mx-auto max-w-6xl">
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
                1ページの型
              </h2>
              <p className="mt-4 max-w-2xl text-paper-dim">
                すべてのきずあとは、同じ骨格で書く。SEOに強く、読んですぐ動ける。
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
                  いま索引している痛み
                </h2>
                <Link href="/kizu" className="text-sm text-scar hover:underline">
                  すべて見る →
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
