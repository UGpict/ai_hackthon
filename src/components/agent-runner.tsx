"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  buildAgentRun,
  getAgent,
  type AgentStep,
  type ScarDraft,
} from "@/lib/agents";
import { LiveOpsFeed } from "@/components/agent-crew";

type Phase = "idle" | "running" | "done";

export function AgentRunner({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIndex, setStepIndex] = useState(-1);
  const [log, setLog] = useState<AgentStep[]>([]);
  const [draft, setDraft] = useState<ScarDraft | null>(null);
  const [pending, startTransition] = useTransition();

  const plan = useMemo(() => buildAgentRun(query), [query]);

  useEffect(() => {
    if (phase !== "running") return;
    if (stepIndex >= plan.steps.length) {
      setPhase("done");
      setDraft(plan.draft);
      return;
    }

    const step = plan.steps[stepIndex];
    const timer = window.setTimeout(() => {
      setLog((prev) => [...prev, step]);
      setStepIndex((i) => i + 1);
    }, step?.ms ?? 400);

    return () => window.clearTimeout(timer);
  }, [phase, stepIndex, plan]);

  function startRun(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      setLog([]);
      setDraft(null);
      setStepIndex(0);
      setPhase("running");
    });
  }

  const active =
    phase === "running" && stepIndex >= 0 && stepIndex < plan.steps.length
      ? plan.steps[stepIndex]
      : null;
  const activeAgent = active ? getAgent(active.agentId) : null;

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
        <form onSubmit={startRun} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例）転職して後悔した"
            className="w-full border border-line bg-ink/60 px-4 py-3 text-paper outline-none placeholder:text-paper-dim/60 focus:border-scar"
            disabled={phase === "running"}
          />
          <button
            type="submit"
            className="cta shrink-0 disabled:opacity-60"
            disabled={phase === "running" || pending || !query.trim()}
          >
            {phase === "running" ? "稼働中…" : "エージェントを動かす"}
          </button>
        </form>

        <p className="mt-3 text-sm text-paper-dim">
          サグリが意図を拾い、ケズリが削り、トジがSEOで閉じる。あなたの痛い検索語のために働く様子が見える。
        </p>

        <div className="mt-8 min-h-[12rem] border border-line bg-ink-soft/40 p-5">
          {phase === "idle" ? (
            <p className="text-paper-dim leading-7">
              検索語を入れて起動すると、3体が順番に手を動かす。
              成果物は「きずあと」ページの下書きになる。
            </p>
          ) : null}

          {activeAgent && active ? (
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
                  {active.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-paper-dim">
                  {active.detail}
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
              <Link
                href={`/kizu`}
                className="cta mt-6 inline-flex"
              >
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
