"use client";

import { useEffect, useState } from "react";
import { buildSerpRaid, type SerpRaidPlan } from "@/lib/serp-raid";

type Props = {
  query: string;
  occupied: boolean;
  pulsing?: boolean;
};

export function SerpRaidBoard({ query, occupied, pulsing }: Props) {
  const [plan, setPlan] = useState<SerpRaidPlan>(() => buildSerpRaid(query));

  useEffect(() => {
    setPlan(buildSerpRaid(query));
  }, [query]);

  return (
    <div className="border border-line bg-[#0e1116]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-paper-dim">
            Google · Pain SERP
          </p>
          <p className="mt-1 font-mono text-sm text-paper">
            {plan.query}
          </p>
        </div>
        <p
          className={`text-xs tracking-[0.15em] ${
            occupied ? "text-honey" : "text-paper-dim"
          }`}
        >
          {occupied ? "OCCUPIED / #1" : "UNCLAIMED"}
        </p>
      </div>

      <p className="border-b border-line px-4 py-2 text-xs text-paper-dim">
        意図: {plan.intent}
      </p>

      <ol className="divide-y divide-line">
        {occupied ? (
          <li
            className={`bg-honey/15 px-4 py-4 ${
              pulsing ? "serp-claim-pulse" : ""
            }`}
          >
            <p className="text-[10px] font-bold tracking-[0.2em] text-honey">
              #1 · きずあと
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
        ) : null}

        {plan.rivals.map((rival, i) => (
          <li
            key={rival.url}
            className={`px-4 py-4 ${occupied ? "opacity-45" : ""}`}
          >
            <p className="text-[10px] tracking-[0.15em] text-paper-dim">
              #{occupied ? i + 2 : i + 1} ·{" "}
              {rival.kind === "media"
                ? "まとめ記事"
                : rival.kind === "forum"
                  ? "掲示板"
                  : "一般ブログ"}
            </p>
            <p className="mt-1 text-base text-[#8ab4f8]">{rival.title}</p>
            <p className="mt-1 font-mono text-xs text-[#81c995]">{rival.url}</p>
            <p className="mt-2 text-sm leading-6 text-paper-dim">
              {rival.snippet}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
