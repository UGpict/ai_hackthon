import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { agents } from "@/lib/agents";
import { getPain, getRelatedPains, pains } from "@/lib/pains";
import { SITE } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return pains.map((pain) => ({ slug: pain.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const pain = getPain(slug);
  if (!pain) return {};

  const title = `${pain.query}｜先に痛い事実`;
  const description = `${pain.lead} ${pain.whyNow}`.slice(0, 120);

  return {
    title,
    description,
    keywords: [pain.query, ...pain.also],
    alternates: {
      canonical: `${SITE.url}/kizu/${pain.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/kizu/${pain.slug}`,
      type: "article",
      locale: "ja_JP",
    },
  };
}

export default async function PainPage({ params }: { params: Params }) {
  const { slug } = await params;
  const pain = getPain(slug);
  if (!pain) notFound();

  const related = getRelatedPains(pain);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pain.query,
    description: pain.lead,
    inLanguage: "ja-JP",
    author: {
      "@type": "Organization",
      name: SITE.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: `${SITE.url}/kizu/${pain.slug}`,
    keywords: [pain.query, ...pain.also].join(", "),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `「${pain.query}」で検索する人は今どんな状態？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: pain.whyNow,
        },
      },
      {
        "@type": "Question",
        name: `${pain.query}のときに先に知っておくべき事実は？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: pain.scars.join(" "),
        },
      },
      {
        "@type": "Question",
        name: `${pain.query}のあとに今夜やることは？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: pain.next.join(" "),
        },
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="hero-wash relative flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-10">
          <nav className="text-sm text-paper-dim">
            <Link href="/kizu" className="hover:text-scar">
              きずあと一覧
            </Link>
            <span className="mx-2">/</span>
            <span>{pain.category}</span>
          </nav>

          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-scar">
            {pain.category}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,3.4rem)] leading-tight">
            {pain.query}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-paper-dim">{pain.lead}</p>

          <section className="mt-14 border-t border-line pt-10">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              なぜ今、この語で検索するのか
            </h2>
            <p className="mt-4 leading-8 text-paper/90">{pain.whyNow}</p>
          </section>

          <section className="mt-14 border-t border-line pt-10">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              先に痛い事実
            </h2>
            <ul className="mt-6 space-y-4">
              {pain.scars.map((scar) => (
                <li
                  key={scar}
                  className="border-l-2 border-scar/70 pl-4 leading-8 text-paper/90"
                >
                  {scar}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14 border-t border-line pt-10">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              戻りたかった分岐点
            </h2>
            <ol className="mt-6 space-y-4">
              {pain.forks.map((fork, i) => (
                <li key={fork} className="flex gap-4 leading-8 text-paper/90">
                  <span className="shrink-0 text-scar">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{fork}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14 border-t border-scar/40 bg-ink-soft/50 p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              今夜の一手
            </h2>
            <ol className="mt-6 space-y-4">
              {pain.next.map((item, i) => (
                <li key={item} className="flex gap-4 leading-8">
                  <span className="shrink-0 text-scar">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14 border-t border-line pt-10">
            <h2 className="text-sm tracking-[0.2em] text-paper-dim">
              一緒に検索されやすい語
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {pain.also.map((term) => (
                <li
                  key={term}
                  className="border border-line px-3 py-1.5 text-sm text-paper-dim"
                >
                  {term}
                </li>
              ))}
            </ul>
          </section>

          {related.length > 0 ? (
            <section className="mt-14 border-t border-line pt-10">
              <h2 className="font-[family-name:var(--font-display)] text-2xl">
                関連するきずあと
              </h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/kizu/${item.slug}`}
                      className="pain-link block py-4 text-lg"
                    >
                      {item.query}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-14 border border-line bg-ink-soft/40 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-paper-dim">
              Maintained by crew
            </p>
            <p className="mt-2 text-sm leading-7 text-paper-dim">
              このページはミツバチ・ハニカムの型で保たれている。蜜を運び、煮詰め、光るセルだけ残す——それ以外はやらない。
            </p>
            <ul className="mt-4 flex flex-wrap gap-4">
              {agents.map((agent) => (
                <li key={agent.id} className="flex items-center gap-2">
                  <Image
                    src={agent.portrait}
                    alt={agent.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 border border-line object-cover"
                  />
                  <span className="text-sm" style={{ color: agent.color }}>
                    {agent.name}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/ops" className="mt-5 inline-block text-sm text-honey hover:underline">
              ハニカムで同じ型を回す →
            </Link>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
