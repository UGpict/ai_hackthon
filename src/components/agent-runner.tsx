"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  buildAgentRun,
  getAgent,
  type AgentStep,
  type ScarDraft,
} from "@/lib/agents";
import { LiveOpsFeed } from "@/components/agent-crew";

type Phase = "idle" | "running" | "done";

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

export function AgentRunner({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeStep, setActiveStep] = useState<AgentStep | null>(null);
  const [log, setLog] = useState<AgentStep[]>([]);
  const [draft, setDraft] = useState<ScarDraft | null>(null);
  const runRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => runRef.current?.abort();
  }, []);

  async function startRun() {
    const q = query.trim();
    if (!q || phase === "running") return;

    runRef.current?.abort();
    const controller = new AbortController();
    runRef.current = controller;

    const { steps, draft: nextDraft } = buildAgentRun(q);
    setLog([]);
    setDraft(null);
    setActiveStep(null);
    setPhase("running");

    try {
      for (const step of steps) {
        setActiveStep(step);
        await sleep(step.ms, controller.signal);
        setLog((prev) => [...prev, step]);
      }
      setActiveStep(null);
      setDraft(nextDraft);
      setPhase("done");
    } catch {
      if (!controller.signal.aborted) {
        setPhase("idle");
        setActiveStep(null);
      }
    }
  }

  const activeAgent = activeStep ? getAgent(activeStep.agentId) : null;

  const feedExtra =
    phase !== "idle"
      ? log
          .slice()
          .reverse()
          .map((step, i) => ({
            id: `run-${i}-${step.label}`,
            agentId: step.agentId,
            text: `${step.label} — ${step.detail}`,
            ago: "たった今",
          }))
      : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void startRun();
              }
            }}
            placeholder="例）転職して後悔した"
            className="w-full border border-line bg-ink/60 px-4 py-3 text-paper outline-none placeholder:text-paper-dim/60 focus:border-scar"
            disabled={phase === "running"}
            aria-label="痛い検索語"
          />
          <button
            type="button"
            onClick={() => void startRun()}
            className="cta shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={phase === "running" || !query.trim()}
          >
            {phase === "running" ? "ハック中…" : "この語のSERPをハック"}
          </button>
        </div>

        <p className="mt-3 text-sm text-paper-dim">
          サグリが意図を拾い、ケズリが削り、トジがSEOで閉じる。入力した痛い検索語のSERPだけをハックする。
        </p>

        <div className="mt-8 min-h-[12rem] border border-line bg-ink-soft/40 p-5">
          {phase === "idle" ? (
            <p className="text-paper-dim leading-7">
              検索語を入れて起動すると、3体が順番に手を動かす。
              成果物は「きずあと」ページの下書きになる。
            </p>
          ) : null}

          {activeAgent && activeStep ? (
            <div className="flex items-start gap-4">
              <div className="relative">
                <Image
                  src={activeAgent.portrait}
                  alt={activeAgent.name}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] border border-line object-cover"
                />
                <span className="agent-pulse absolute -right-1 -top-1 h-3 w-3 rounded-full bg-scar" />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: activeAgent.color }}
                >
                  {activeAgent.name} が作業中
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-xl">
                  {activeStep.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-paper-dim">
                  {activeStep.detail}
                </p>
              </div>
            </div>
          ) : null}

          {phase === "done" && draft ? (
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-scar">
                Draft ready
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl">
                {draft.query}
              </h3>
              <p className="mt-2 text-paper-dim">{draft.lead}</p>
            </div>
          ) : null}
        </div>

        {draft ? (
          <article className="mt-8 space-y-8 border border-line p-5 sm:p-7">
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
                    className="border-l-2 border-scar/70 pl-4 leading-7 text-paper/90"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h4 className="font-[family-name:var(--font-display)] text-xl">
                戻りたかった分岐点
              </h4>
              <ol className="mt-3 space-y-3">
                {draft.forks.map((f, i) => (
                  <li key={f} className="flex gap-3 leading-7">
                    <span className="text-scar">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ol>
            </section>
            <section className="bg-ink-soft/50 p-4">
              <h4 className="font-[family-name:var(--font-display)] text-xl">
                今夜の一手
              </h4>
              <ol className="mt-3 space-y-3">
                {draft.next.map((n, i) => (
                  <li key={n} className="flex gap-3 leading-7">
                    <span className="text-scar">{i + 1}.</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h4 className="text-sm tracking-[0.2em] text-paper-dim">
                トジの SEO メモ
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-paper-dim">
                {draft.seoNotes.map((note) => (
                  <li key={note}>· {note}</li>
                ))}
              </ul>
              <Link href="/kizu" className="cta mt-6 inline-flex">
                既存のきずあと索引へ
              </Link>
            </section>
          </article>
        ) : null}
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between">
          <h3 className="font-[family-name:var(--font-display)] text-xl">
            いま動いてるログ
          </h3>
          <span className="text-xs text-paper-dim">for you</span>
        </div>
        <LiveOpsFeed extra={feedExtra} />
      </div>
    </div>
  );
}
