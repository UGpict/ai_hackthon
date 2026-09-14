"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  agents,
  getAgent,
  liveFeed,
  type AgentId,
  type LiveActivity,
} from "@/lib/agents";

const rotatingLines: Record<AgentId, string[]> = {
  mitsu: [
    "痛いクエリの蜜を探してる",
    "関連検索の蜜を運んでる",
    "深夜帯の蜜の濃さを測ってる",
  ],
  hani: [
    "ハニカムで蜜を煮詰めてる",
    "ノイズのセルを暗くしてる",
    "分岐点だけ残してる",
  ],
  comu: [
    "良さげなセルを光らせてる",
    "FAQとリンクで縫ってる",
    "H1一致を確認中",
  ],
};

export function AgentCrewStrip() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 2800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {agents.map((agent, i) => {
        const lines = rotatingLines[agent.id];
        const line = lines[(tick + i) % lines.length];
        return (
          <article
            key={agent.id}
            className="agent-card relative overflow-hidden border border-line bg-ink/50 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="bee-buzz relative h-16 w-16 shrink-0 overflow-hidden border border-honey/30">
                <Image
                  src={agent.portrait}
                  alt={agent.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
                <span
                  className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full ring-2 ring-ink"
                  style={{ background: agent.color }}
                  aria-hidden
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-[family-name:var(--font-display)] text-xl">
                    {agent.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-paper-dim">
                    {agent.role}
                  </span>
                </div>
                <p className="mt-1 text-sm text-paper-dim">{agent.job}</p>
                <p
                  className="mt-3 flex items-center gap-2 text-xs"
                  style={{ color: agent.color }}
                >
                  <span className="agent-pulse inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="truncate">{line}</span>
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function LiveOpsFeed({ extra }: { extra?: LiveActivity[] }) {
  const items = [...(extra ?? []), ...liveFeed].slice(0, 8);

  return (
    <ul className="divide-y divide-line border border-line bg-ink/40">
      {items.map((item) => {
        const agent = getAgent(item.agentId);
        return (
          <li key={item.id} className="flex items-start gap-3 px-4 py-3">
            <Image
              src={agent.portrait}
              alt=""
              width={36}
              height={36}
              className="mt-0.5 h-9 w-9 border border-honey/20 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="text-sm font-medium"
                  style={{ color: agent.color }}
                >
                  {agent.name}
                </span>
                <span className="shrink-0 text-xs text-paper-dim">{item.ago}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-paper/90">{item.text}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
