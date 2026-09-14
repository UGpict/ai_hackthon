import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <div className="hero-wash relative flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-20 sm:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-scar">404</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">
          このきずあとはまだ無い
        </h1>
        <p className="mt-4 text-paper-dim leading-relaxed">
          痛い検索語は日々増える。一覧から近い傷を探すか、トップに戻ってください。
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/kizu" className="cta">
            一覧へ
          </Link>
          <Link href="/" className="cta-ghost">
            トップへ
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
