"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  computeSeoChecks,
  extractPainFromWorkLog,
  refuseReasonLabel,
  SAMPLE_WORK_LOG,
  type PainCandidate,
} from "@/lib/pain-extract";

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

/**
 * Ops console aimed at a skeptical senior engineer:
 * work log → heuristic extract → human approve → bee theatre → sourced draft.
 */
export function AgentRunner() {
  const [workLog, setWorkLog] = useState(SAMPLE_WORK_LOG);
  const [extraction, setExtraction] = useState(() =>
    extractPainFromWorkLog(SAMPLE_WORK_LOG),
  );
  const [approvedIds, setApprovedIds] = useState<Set<string>>(() => {
    const first = extractPainFromWorkLog(SAMPLE_WORK_LOG).kept[0];
    return first ? new Set([first.id]) : new Set();
  });
  const [primaryId, setPrimaryId] = useState<string | null>(
    () => extractPainFromWorkLog(SAMPLE_WORK_LOG).kept[0]?.id ?? null,
  );

  const [phase, setPhase] = useState<Phase>("idle");
  const [activeStep, setActiveStep] = useState<AgentStep | null>(null);
  const [log, setLog] = useState<AgentStep[]>([]);
  const [draft, setDraft] = useState<ScarDraft | null>(null);
  const [cells, setCells] = useState<HoneyCell[]>(() =>
    initialHoneycomb("仕事ログから抽出"),
  );
  const runRef = useRef<AbortController | null>(null);

  useEffect(() => () => runRef.current?.abort(), []);

  const approved = useMemo(
    () => extraction.kept.filter((k) => approvedIds.has(k.id)),
    [extraction.kept, approvedIds],
  );
  const primary =
    approved.find((a) => a.id === primaryId) ?? approved[0] ?? null;

  function runExtract() {
    const next = extractPainFromWorkLog(workLog);
    setExtraction(next);
    setDraft(null);
    setPhase("idle");
    setLog([]);
    const top = next.kept[0];
    setApprovedIds(top ? new Set([top.id]) : new Set());
    setPrimaryId(top?.id ?? null);
    setCells(initialHoneycomb(top?.phrase ?? "未抽出"));
  }

  function toggleApprove(c: PainCandidate) {
    setApprovedIds((prev) => {
      const next = new Set(prev);
      if (next.has(c.id)) next.delete(c.id);
      else next.add(c.id);
      return next;
    });
    setPrimaryId((prev) => prev ?? c.id);
  }

  async function startRun() {
    if (!primary || phase === "running") return;

    runRef.current?.abort();
    const controller = new AbortController();
    runRef.current = controller;

    const approvedPayload = approved.map((a) => ({
      phrase: a.phrase,
      sourceLine: a.sourceLine,
    }));

    const { steps, draft: nextDraft, highlightIds } = buildAgentRun(
      primary.phrase,
      approvedPayload,
    );

    setLog([]);
    setDraft(null);
    setActiveStep(null);

    let board = initialHoneycomb(primary.phrase);
    setCells(board);
    setPhase("running");

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
      setPhase("done");
    } catch {
      if (!controller.signal.aborted) {
        setPhase("idle");
        setActiveStep(null);
      }
    }
  }

  const activeAgent = activeStep ? getAgent(activeStep.agentId) : null;

  const seoChecks = draft
    ? computeSeoChecks({
        phrase: draft.query,
        hasWhyNow: draft.whyNow.length > 20,
        scarCount: draft.scars.length,
        forkCount: draft.forks.length,
        nextCount: draft.next.length,
        hasSources: draft.sources.some(
          (s) => !s.sourceLine.includes("手打ち"),
        ),
      })
    : [];

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
    <div className="space-y-10">
      <div className="border border-honey/40 bg-honey/5 px-4 py-3 text-sm leading-7 text-paper-dim">
        <strong className="text-honey">正直ラベル：</strong>
        抽出は LLM ではなくローカル規則（{extraction.method}）。
        ミツバチの動きは進捗の可視化用で、ネットワーク呼び出しではない。
        下書き生成の前に、人がセルを採用する。
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <section>
            <h3 className="font-[family-name:var(--font-display)] text-xl">
              1. 仕事ログを貼る
            </h3>
            <p className="mt-2 text-sm text-paper-dim">
              商談メモ・問い合わせ・チャット。キーワードを空想しない。
            </p>
            <textarea
              value={workLog}
              onChange={(e) => setWorkLog(e.target.value)}
              rows={10}
              className="mt-3 w-full border border-line bg-ink/60 px-4 py-3 font-mono text-sm leading-6 text-paper outline-none focus:border-honey"
              disabled={phase === "running"}
            />
            <button
              type="button"
              onClick={runExtract}
              className="cta mt-3"
              disabled={phase === "running" || !workLog.trim()}
            >
              痛み言葉を抽出する
            </button>
          </section>

          <section>
            <h3 className="font-[family-name:var(--font-display)] text-xl">
              2. 人が採用する（自動全採用しない）
            </h3>
            <p className="mt-2 text-sm text-paper-dim">
              残す候補 {extraction.kept.length} / 拒否 {extraction.refused.length}
              。主クエリを1つ選び、関連を追加採用。
            </p>

            <ul className="mt-4 divide-y divide-line border border-line">
              {extraction.kept.length === 0 ? (
                <li className="px-4 py-5 text-sm text-paper-dim">
                  痛み信号のある行がありません。ログを増やすか、文言を具体化してください。
                </li>
              ) : (
                extraction.kept.map((c) => {
                  const checked = approvedIds.has(c.id);
                  const isPrimary = primary?.id === c.id;
                  return (
                    <li
                      key={c.id}
                      className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <label className="flex cursor-pointer gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleApprove(c)}
                          disabled={phase === "running"}
                          className="mt-1"
                        />
                        <span>
                          <span className="block text-paper">{c.phrase}</span>
                          <span className="mt-1 block text-xs text-paper-dim">
                            出典: {c.sourceLine.slice(0, 80)}
                            {c.sourceLine.length > 80 ? "…" : ""}
                          </span>
                          <span className="mt-1 block text-xs text-honey">
                            score {c.score}
                          </span>
                        </span>
                      </label>
                      <button
                        type="button"
                        className={`shrink-0 border px-3 py-1 text-xs ${
                          isPrimary
                            ? "border-honey text-honey"
                            : "border-line text-paper-dim"
                        }`}
                        disabled={!checked || phase === "running"}
                        onClick={() => setPrimaryId(c.id)}
                      >
                        {isPrimary ? "主クエリ" : "主にする"}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            {extraction.refused.length > 0 ? (
              <details className="mt-4 border border-line p-4 text-sm text-paper-dim">
                <summary className="cursor-pointer text-paper">
                  拒否した行（{extraction.refused.length}）— コードで落とす
                </summary>
                <ul className="mt-3 space-y-2">
                  {extraction.refused.slice(0, 12).map((r) => (
                    <li key={r.id}>
                      <span className="text-paper/80">{r.phrase}</span>
                      <span className="mt-0.5 block text-xs text-scar">
                        {r.reason ? refuseReasonLabel(r.reason) : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </section>

          <section>
            <h3 className="font-[family-name:var(--font-display)] text-xl">
              3. ハニカムへ運ぶ
            </h3>
            <button
              type="button"
              onClick={() => void startRun()}
              className="cta mt-3 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={phase === "running" || !primary}
            >
              {phase === "running"
                ? "搬入中…"
                : primary
                  ? `「${primary.phrase.slice(0, 16)}」を運ばせる`
                  : "先に採用してください"}
            </button>

            <div className="mt-6">
              <HoneycombBoard cells={cells} />
            </div>

            <div className="mt-6 min-h-[7rem] border border-line bg-ink-soft/40 p-5">
              {phase === "idle" ? (
                <p className="text-sm leading-7 text-paper-dim">
                  採用した痛み言葉だけがセルに載る。光るのは承認済みの入口。
                </p>
              ) : null}
              {activeAgent && activeStep ? (
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Image
                      src={activeAgent.portrait}
                      alt={activeAgent.name}
                      width={64}
                      height={64}
                      className="bee-buzz h-16 w-16 border border-honey/30 object-cover"
                    />
                    <span className="agent-pulse absolute -right-1 -top-1 h-3 w-3 rounded-full bg-honey" />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: activeAgent.color }}
                    >
                      {activeAgent.name}（演出付き進捗）
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-lg">
                      {activeStep.label}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-paper-dim">
                      {activeStep.detail}
                    </p>
                  </div>
                </div>
              ) : null}
              {phase === "done" && draft ? (
                <p className="text-sm text-honey">
                  下書き準備完了 · 出典 {draft.sources.length} 件
                </p>
              ) : null}
            </div>
          </section>

          {draft ? (
            <article className="space-y-8 border border-line p-5 sm:p-7">
              <header>
                <p className="text-xs uppercase tracking-[0.25em] text-honey">
                  Sourced draft
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl">
                  {draft.query}
                </h3>
                <p className="mt-2 text-paper-dim">{draft.lead}</p>
              </header>

              <section>
                <h4 className="font-[family-name:var(--font-display)] text-xl">
                  出典（仕事ログ）
                </h4>
                <ul className="mt-3 space-y-3 text-sm">
                  {draft.sources.map((s) => (
                    <li
                      key={s.phrase + s.sourceLine}
                      className="border-l-2 border-honey/70 pl-3"
                    >
                      <span className="text-paper">{s.phrase}</span>
                      <span className="mt-1 block text-paper-dim">
                        {s.sourceLine}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

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

              <section>
                <h4 className="font-[family-name:var(--font-display)] text-xl">
                  戻りたかった分岐点
                </h4>
                <ol className="mt-3 space-y-3">
                  {draft.forks.map((f, i) => (
                    <li key={f} className="flex gap-3 leading-7">
                      <span className="text-honey">
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
                      <span className="text-honey">{i + 1}.</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h4 className="font-[family-name:var(--font-display)] text-xl">
                  SEOチェック（計算結果）
                </h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {seoChecks.map((c) => (
                    <li key={c.id} className="flex gap-2">
                      <span className={c.pass ? "text-honey" : "text-scar"}>
                        {c.pass ? "PASS" : "FAIL"}
                      </span>
                      <span className="text-paper-dim">{c.label}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/kizu" className="cta mt-6 inline-flex">
                  既存索引へ
                </Link>
              </section>
            </article>
          ) : null}
        </div>

        <div>
          <div className="mb-3 flex items-end justify-between">
            <h3 className="font-[family-name:var(--font-display)] text-xl">
              進捗ログ
            </h3>
            <span className="text-xs text-paper-dim">theatre ≠ network</span>
          </div>
          <LiveOpsFeed extra={feedExtra} />
        </div>
      </div>
    </div>
  );
}
