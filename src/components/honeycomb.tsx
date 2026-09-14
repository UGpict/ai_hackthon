"use client";

import type { HoneyCell } from "@/lib/agents";

type Props = {
  cells: HoneyCell[];
  title?: string;
};

/** Honeycomb board: bees bring ideas in; promising cells light up. */
export function HoneycombBoard({
  cells,
  title = "ハニカム — 良さげな蜜が光る",
}: Props) {
  // staggered rows of 4 / 3 / 4 / 3 for honeycomb feel
  const rows = [cells.slice(0, 4), cells.slice(4, 7), cells.slice(7, 11), cells.slice(11, 12)];

  return (
    <div className="honeycomb-wrap border border-line bg-ink/50 p-4 sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h3 className="font-[family-name:var(--font-display)] text-lg sm:text-xl">
          {title}
        </h3>
        <p className="text-[10px] uppercase tracking-[0.22em] text-honey">
          lit = keep
        </p>
      </div>

      <div className="honeycomb" aria-label="アイデアのハニカム">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`honeycomb-row ${rowIndex % 2 === 1 ? "honeycomb-row-offset" : ""}`}
          >
            {row.map((cell) => (
              <div
                key={cell.id}
                className={`hex hex-${cell.state}`}
                title={cell.label}
              >
                <span className="hex-inner">
                  <span className="hex-label">{cell.label}</span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <ul className="mt-5 flex flex-wrap gap-3 text-xs text-paper-dim">
        <li className="flex items-center gap-1.5">
          <i className="legend-dot legend-incoming" /> 搬入中
        </li>
        <li className="flex items-center gap-1.5">
          <i className="legend-dot legend-candidate" /> 候補
        </li>
        <li className="flex items-center gap-1.5">
          <i className="legend-dot legend-lit" /> 光ってる（採用）
        </li>
        <li className="flex items-center gap-1.5">
          <i className="legend-dot legend-dim" /> 落とす
        </li>
      </ul>
    </div>
  );
}

/** Idle preview honeycomb that gently pulses a few cells. */
export function HoneycombPreview() {
  const demo: HoneyCell[] = [
    { id: "p0", label: "転職後悔", state: "lit" },
    { id: "p1", label: "資金ショート", state: "candidate" },
    { id: "p2", label: "副業バレ", state: "incoming" },
    { id: "p3", label: "案件切れ", state: "lit" },
    { id: "p4", label: "一般論", state: "dim" },
    { id: "p5", label: "精神論", state: "dim" },
    { id: "p6", label: "今夜の一手", state: "lit" },
    { id: "p7", label: "分岐点", state: "candidate" },
    { id: "p8", label: "FAQ", state: "lit" },
    { id: "p9", label: "内部リンク", state: "incoming" },
    { id: "p10", label: "H1一致", state: "lit" },
    { id: "p11", label: "比較記事", state: "dim" },
  ];

  return <HoneycombBoard cells={demo} title="ミツバチたちが運んできた蜜" />;
}
