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
      <nav className="flex items-center gap-4 text-sm text-paper-dim sm:gap-5">
        <Link href="/kizu" className="transition-colors hover:text-scar">
          索引
        </Link>
        <Link href="/ops" className="transition-colors hover:text-scar">
          稼働室
        </Link>
        <Link
          href="/#crew"
          className="hidden transition-colors hover:text-scar sm:inline"
        >
          三人
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
        <div className="flex gap-4">
          <Link href="/ops" className="hover:text-scar">
            稼働室
          </Link>
          <p>© {new Date().getFullYear()} {SITE.nameEn}</p>
        </div>
      </div>
    </footer>
  );
}
