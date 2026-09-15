import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { allCategories, pains } from "@/lib/pains";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "きずあと一覧",
  description:
    "痛い検索語から入る、原体験の圧縮ページ一覧。転職・起業・副業・職場・人生の分岐点を索引しています。",
  alternates: {
    canonical: `${SITE.url}/kizu`,
  },
};

type SearchParams = Promise<{ q?: string; category?: string }>;

export default async function KizuIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q = "", category = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const filtered = pains.filter((pain) => {
    const matchesCategory = !category || pain.category === category;
    const haystack = [pain.query, pain.lead, ...pain.also, pain.category]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesCategory && matchesQuery;
  });

  const categories = allCategories();

  return (
    <div className="hero-wash relative flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-scar">Index</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          きずあと一覧
        </h1>
        <p className="mt-4 max-w-2xl text-paper-dim leading-relaxed">
          奪いにいってる痛い検索語の索引。ここは記事の目次ではなく、Pain SERP の戦場マップ。
        </p>

        <form className="mt-10 flex flex-col gap-3 sm:flex-row" action="/kizu" method="get">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="痛い検索語で探す"
            className="w-full border border-line bg-ink/60 px-4 py-3 text-paper outline-none placeholder:text-paper-dim/60 focus:border-scar"
          />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          <button type="submit" className="cta shrink-0">
            探す
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={q ? `/kizu?q=${encodeURIComponent(q)}` : "/kizu"}
            className={`border px-3 py-1.5 text-sm ${
              !category ? "border-scar text-scar" : "border-line text-paper-dim"
            }`}
          >
            すべて
          </Link>
          {categories.map((cat) => {
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            params.set("category", cat);
            return (
              <Link
                key={cat}
                href={`/kizu?${params.toString()}`}
                className={`border px-3 py-1.5 text-sm ${
                  category === cat
                    ? "border-scar text-scar"
                    : "border-line text-paper-dim"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        <ul className="mt-12 divide-y divide-line border-y border-line">
          {filtered.length === 0 ? (
            <li className="py-10 text-paper-dim">該当するきずあとがありません。</li>
          ) : (
            filtered.map((pain) => (
              <li key={pain.slug}>
                <Link
                  href={`/kizu/${pain.slug}`}
                  className="pain-link block py-6"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <h2 className="text-xl sm:text-2xl">{pain.query}</h2>
                    <span className="text-sm text-paper-dim">{pain.category}</span>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-paper-dim sm:text-base">
                    {pain.lead}
                  </p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
