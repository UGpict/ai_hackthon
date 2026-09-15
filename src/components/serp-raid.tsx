"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  buildSerpRaid,
  type ClaimRank,
  type SerpRaidPlan,
} from "@/lib/serp-raid";

type Props = {
  query: string;
  /** null = rivals own the page; 3/2/1 = your climb; 1 = stolen */
  claimRank: ClaimRank;
};

function statusLabel(rank: ClaimRank) {
  if (rank === 1) return "STOLEN · #1";
  if (rank === 2) return "CLIMBING · #2";
  if (rank === 3) return "INJECTED · #3";
  return "RIVALS OWN THIS";
}

export function SerpRaidBoard({ query, claimRank }: Props) {
  const [plan, setPlan] = useState<SerpRaidPlan>(() => buildSerpRaid(query));

  useEffect(() => {
    setPlan(buildSerpRaid(query));
  }, [query]);

  const yourRow =
    claimRank !== null ? (
      <li
        className={`px-4 py-4 ${
          claimRank === 1
            ? "serp-claim-pulse bg-honey/20"
            : "bg-honey/10"
        }`}
      >
        <p className="text-[10px] font-bold tracking-[0.2em] text-honey">
          #{claimRank} · きずあと
          {claimRank === 1 ? " · 占領" : " · 押し上げ中"}
        </p>
        <p className="mt-1 text-lg text-[#8ab4f8] underline-offset-2">
          {plan.yourTitle}
        </p>
        <p className="mt-1 font-mono text-xs text-[#81c995]">
          kizuato.app/kizu/...
        </p>
        <p className="mt-2 text-sm leading-6 text-paper-dim">
          {plan.yourSnippet}
        </p>
      </li>
    ) : null;

  const rivalRows = plan.rivals.map((rival, i) => {
    const displayRank =
      claimRank === null
        ? i + 1
        : claimRank === 1
          ? i + 2
          : i < claimRank - 1
            ? i + 1
            : i + 2;

    return (
      <li
        key={rival.url}
        className={`px-4 py-4 ${claimRank === 1 ? "opacity-40" : ""}`}
      >
        <p className="text-[10px] tracking-[0.15em] text-paper-dim">
          #{displayRank} ·{" "}
          {rival.kind === "media"
            ? "まとめ記事"
            : rival.kind === "forum"
              ? "掲示板"
              : "一般ブログ"}
        </p>
        <p className="mt-1 text-base text-[#8ab4f8]">{rival.title}</p>
        <p className="mt-1 font-mono text-xs text-[#81c995]">{rival.url}</p>
        <p className="mt-2 text-sm leading-6 text-paper-dim">{rival.snippet}</p>
      </li>
    );
  });

  const rows: ReactNode[] = [];
  if (claimRank === null) {
    rows.push(...rivalRows);
  } else if (claimRank === 1) {
    rows.push(yourRow, ...rivalRows);
  } else if (claimRank === 2) {
    rows.push(rivalRows[0], yourRow, rivalRows[1], rivalRows[2]);
  } else {
    rows.push(rivalRows[0], rivalRows[1], yourRow, rivalRows[2]);
  }

  return (
    <div className="border border-line bg-[#0e1116]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-paper-dim">
            Google · Pain SERP
          </p>
          <p className="mt-1 font-mono text-sm text-paper">{plan.query}</p>
        </div>
        <p
          className={`text-xs tracking-[0.12em] ${
            claimRank === 1
              ? "text-honey"
              : claimRank
                ? "text-scar"
                : "text-paper-dim"
          }`}
        >
          {statusLabel(claimRank)}
        </p>
      </div>

      <p className="border-b border-line px-4 py-2 text-xs text-paper-dim">
        意図: {plan.intent}
      </p>

      <ol className="divide-y divide-line">{rows}</ol>
    </div>
  );
}
