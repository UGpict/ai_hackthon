import { HACK } from "@/lib/hack";

export function HackWedge() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-scar">The hack</p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-snug sm:text-4xl">
          {HACK.oneLiner}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-paper-dim sm:text-lg">
          ハッカソンだからこそ、業務をちょっと良くする案は捨てる。ハック対象は一つ——
          <span className="text-paper">{HACK.target}</span>。
        </p>
        <p className="mt-4 max-w-xl border-l-2 border-scar pl-4 text-sm leading-7 text-paper/90 sm:text-base">
          {HACK.wedge}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="border border-scar/40 bg-scar/5 p-5">
          <h3 className="text-xs tracking-[0.25em] text-scar">OWN</h3>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-paper/90">
            {HACK.owns.map((item) => (
              <li key={item}>→ {item}</li>
            ))}
          </ul>
        </div>
        <div className="border border-line p-5">
          <h3 className="text-xs tracking-[0.25em] text-paper-dim">REFUSE</h3>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-paper-dim">
            {HACK.refuses.map((item) => (
              <li key={item}>× {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function SerpHackMap() {
  const rows = [
    { label: "情報収集クエリ", note: "捨てる", ours: false },
    { label: "比較・検討クエリ", note: "捨てる", ours: false },
    { label: "痛い瞬間クエリ", note: "ここだけ取る", ours: true },
    { label: "事後の一般論記事", note: "捨てる", ours: false },
  ];

  return (
    <div className="border border-line">
      <div className="border-b border-line px-4 py-3 text-xs tracking-[0.25em] text-paper-dim">
        SERP WEDGE — 何をハックするか
      </div>
      <ul>
        {rows.map((row) => (
          <li
            key={row.label}
            className={`flex items-center justify-between gap-4 border-b border-line px-4 py-4 last:border-b-0 ${
              row.ours ? "bg-scar/10" : "opacity-55"
            }`}
          >
            <span className={row.ours ? "text-paper" : "text-paper-dim"}>
              {row.label}
            </span>
            <span
              className={`text-sm ${row.ours ? "text-scar" : "text-paper-dim"}`}
            >
              {row.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
