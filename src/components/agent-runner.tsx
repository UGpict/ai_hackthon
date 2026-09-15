"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  buildAgentRun,
  getAgent,
  initialHoneycomb,
  type AgentStep,
  type HoneyCell,
  type ScarDraft,
} from "@/lib/agents";
import { LiveOpsFeed } from "@/components/agent-crew";
import { HoneycombBoard } from "@/components/honeycomb";
import { SerpRaidBoard } from "@/components/serp-raid";

type Phase = "idle" | "raiding" | "occupied";

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = window.setTimeout(() => resolve(), ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function applyCellUpdates(
  cells: HoneyCell[],
  updates: NonNullable<AgentStep["cells"]>,
): HoneyCell[] {
  const map = new Map(cells.map((c) => [c.id, { ...c }]));
  for (const u of updates) {
    const prev = map.get(u.id);
    if (!prev) continue;
    map.set(u.id, {
      ...prev,
      label: u.label ?? prev.label,
      state: u.state,
    });
  }
  return cells.map((c) => map.get(c.id) ?? c);
}

/** Pain-query SERP raid: bees claim the slot, honeycomb lights, draft locks #1. */
export function AgentRunner({ initialQuery = "転職して後悔した" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeStep, setActiveStep] = useState<AgentStep | null>(null);
  const [log, setLog] = useState<AgentStep[]>([]);
  const [draft, setDraft] = useState<ScarDraft | null>(null);
  const [cells, setCells] = useState<HoneyCell[]>(() =>
    initialHoneycomb(initialQuery),
  );
  const [occupiedCount, setOccupiedCount] = useState(0);
  const runRef = useRef<AbortController | null>(null);

  useEffect(() => () => runRef.current?.abort(), []);

  async function startRaid() {
    const q = query.trim();
    if (!q || phase === "raiding") return;

    runRef.current?.abort();
    const controller = new AbortController();
    runRef.current = controller;

    const { steps, draft: nextDraft, highlightIds } = buildAgentRun(q);
    setLog([]);
    setDraft(null);
    setActiveStep(null);

    let board = initialHoneycomb(q);
    setCells(board);
    setPhase("raiding");

    try {
      for (const step of steps) {
        setActiveStep(step);
        if (step.cells?.length) {
          board = applyCellUpdates(board, step.cells);
          setCells(board.map((c) => ({ ...c })));
        }
        await sleep(step.ms, controller.signal);
        setLog((prev) => [...prev, step]);
      }

      const winners = new Set(highlightIds);
      board = board.map((cell) => {
        if (winners.has(cell.id)) return { ...cell, state: "lit" as const };
        if (cell.state === "incoming" || cell.state === "candidate") {
          return { ...cell, state: "dim" as const };
        }
        return cell;
      });
      setCells(board.map((c) => ({ ...c })));
      setActiveStep(null);
      setDraft(nextDraft);
      setOccupiedCount((n) => n + 1);
      setPhase("occupied");
    } catch {
      if (!controller.signal.aborted) {
        setPhase("idle");
        setActiveStep(null);
      }
    }
  }

  const occupied = phase === "occupied";
  const claiming = phase === "raiding";

  const feedExtra =
    phase !== "idle"
      ? log
          .slice()
          .reverse()
          .map((step, i) => ({
            id: `raid-${i}-${step.label}`,
            agentId: step.agentId,
            text: `${step.label} — ${step.detail}`,
            ago: "たった今",
          }))
      : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void startRaid();
            }
          }}
          placeholder="例）副業がバレた"
          className="w-full border border-line bg-ink/60 px-4 py-3 text-paper outline-none placeholder:text-paper-dim/60 focus:border-honey"
          disabled={phase === "raiding"}
          aria-label="占領したい痛い検索語"
        />
        <button
          type="button"
          onClick={() => void startRaid()}
          className="cta shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={phase === "raiding" || !query.trim()}
        >
          {phase === "raiding" ? "占領中…" : "このSERPを占領する"}
        </button>
      </div>

      <p className="text-sm text-paper-dim">
        新規性はここ：痛い検索語を入れると、競合の一般論SERPの上を取りにいく。
        ハニカムの光＝占領した枠。ミツバチは占領部隊。
        {occupiedCount > 0 ? (
          <span className="ml-2 text-honey">占領数 {occupiedCount}</span>
        ) : null}
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 font-[family-name:var(--font-display)] text-xl">
            SERPレイド
          </h3>
          <SerpRaidBoard
            query={query.trim() || initialQuery}
            occupied={occupied || claiming}
            pulsing={occupied || claiming}
          />
        </div>
        <div>
          <h3 className="mb-3 font-[family-name:var(--font-display)] text-xl">
            占領ハニカム
          </h3>
          <HoneycombBoard
            cells={cells}
            title={occupied ? "光ったセル＝占領した入口" : "ハニカム待機中"}
          />
          <div className="mt-4 min-h-[6.5rem] border border-line bg-ink-soft/40 p-4">
            {phase === "idle" ? (
              <p className="text-sm leading-7 text-paper-dim">
                痛い検索語を入れて占領を開始。ミツが蜜を運び、ハニがノイズを落とし、コムが1位枠を閉じる。
              </p>
            ) : null}
            {activeAgent && activeStep ? (
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Image
                    src={activeAgent.portrait}
                    alt={activeAgent.name}
                    width={56}
                    height={56}
                    className="bee-buzz h-14 w-14 border border-honey/30 object-cover"
                  />
                  <span className="agent-pulse absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-honey" />
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: activeAgent.color }}
                  >
                    {activeAgent.name} が占領作業中
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-lg">
                    {activeStep.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-paper-dim">
                    {activeStep.detail}
                  </p>
                </div>
              </div>
            ) : null}
            {occupied && draft ? (
              <p className="text-sm text-honey">
                SERP #1 を仮押さえ · 下書きロック完了
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {draft ? (
            <article className="space-y-7 border border-honey/40 p-5 sm:p-7">
              <header>
                <p className="text-xs uppercase tracking-[0.25em] text-honey">
                  Occupying page
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl">
                  {draft.query}
                </h3>
                <p className="mt-2 text-paper-dim">{draft.lead}</p>
              </header>
              <section>
                <h4 className="font-[family-name:var(--font-display)] text-xl">
                  なぜ今
                </h4>
                <p className="mt-3 leading-8 text-paper/90">{draft.whyNow}</p>
              </section>
              <section>
                <h4 className="font-[family-name:var(--font-display)] text-xl">
                  先に痛い事実
                </h4>
                <ul className="mt-3 space-y-3">
                  {draft.scars.map((s) => (
                    <li
                      key={s}
                      className="border-l-2 border-honey/80 pl-4 leading-7 text-paper/90"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
              <section className="bg-ink-soft/50 p-4">
                <h4 className="font-[family-name:var(--font-display)] text-xl">
                  今夜の一手
                </h4>
                <ol className="mt-3 space-y-3">
                  {draft.next.map((n, i) => (
                    <li key={n} className="flex gap-3 leading-7">
                      <span className="text-honey">{i + 1}.</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ol>
              </section>
              <Link href="/kizu" className="cta inline-flex">
                占領一覧（索引）へ
              </Link>
            </article>
          ) : (
            <div className="border border-dashed border-line p-8 text-sm leading-7 text-paper-dim">
              占領が終わると、このSERPを取るためのきずあとページがここに出る。
              ワクワクの本体は「一般論の上を取った」感覚。
            </div>
          )}
        </div>
        <div>
          <div className="mb-3 flex items-end justify-between">
            <h3 className="font-[family-name:var(--font-display)] text-xl">
              占領ログ
            </h3>
            <span className="text-xs text-honey">raid feed</span>
          </div>
          <LiveOpsFeed extra={feedExtra} />
        </div>
      </div>
    </div>
  );
}
