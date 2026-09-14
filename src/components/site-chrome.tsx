import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10">
      <Link
        href="/"
        className="font-[family-name:var(--font-display)] text-2xl tracking-[0.08em] sm:text-3xl"
      >
        {SITE.name}
      </Link>
      <nav className="flex items-center gap-5 text-sm text-paper-dim">
        <Link href="/kizu" className="transition-colors hover:text-scar">
          きずあと一覧
        </Link>
        <Link href="/#how" className="hidden transition-colors hover:text-scar sm:inline">
          仕組み
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t border-line px-5 py-10 text-sm text-paper-dim sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl text-paper">
            {SITE.name}
          </p>
          <p className="mt-1 max-w-md leading-relaxed">{SITE.tagline}</p>
        </div>
        <p>© {new Date().getFullYear()} {SITE.nameEn}</p>
      </div>
    </footer>
  );
}
