/**
 * Work-log → pain phrase extraction.
 * Deterministic heuristics only (no LLM). Built so a skeptical engineer
 * can read the rules and disagree with them in code review.
 */

export type RefuseReason =
  | "too_generic"
  | "comparison_shopping"
  | "howto_encyclopedia"
  | "too_short"
  | "duplicate"
  | "no_pain_signal";

export type PainCandidate = {
  id: string;
  phrase: string;
  sourceLine: string;
  sourceIndex: number;
  score: number;
  status: "keep" | "refuse";
  reason?: RefuseReason;
};

export type ExtractionResult = {
  kept: PainCandidate[];
  refused: PainCandidate[];
  method: "local-heuristics-v1";
};

const PAIN_SIGNALS = [
  "後悔",
  "失敗",
  "不安",
  "困る",
  "困って",
  "つらい",
  "辛い",
  "痛い",
  "ミス",
  "怒",
  "苦情",
  "クレーム",
  "辞め",
  "疲れ",
  "バレ",
  "ショート",
  "切れ",
  "無理",
  "遅すぎ",
  "高すぎ",
  "損した",
  "わからな",
  "できな",
  "詰んだ",
  "終わった",
  "やば",
  "怖い",
  "孤独",
  "見捨て",
  "泣",
];

const REFUSE_PATTERNS: { reason: RefuseReason; re: RegExp }[] = [
  {
    reason: "comparison_shopping",
    re: /(比較|おすすめ|ランキング|ベスト|vs|対比|どれがいい)/i,
  },
  {
    reason: "howto_encyclopedia",
    re: /(とは$|とは？|意味は|方法一覧|テンプレート|定義|仕組みについて)/,
  },
  {
    reason: "too_generic",
    re: /(マーケティング全般|業務改善|生産性向上|SEO対策$|コンテンツ戦略)/,
  },
];

const REFUSE_REASON_JA: Record<RefuseReason, string> = {
  too_generic: "汎用すぎる。Pain SERPの入口にならない",
  comparison_shopping: "比較検討クエリ。OWN外",
  howto_encyclopedia: "事典・ハウツー。痛い瞬間ではない",
  too_short: "短すぎて検索意図が取れない",
  duplicate: "重複",
  no_pain_signal: "痛みの信号語がない",
};

export function refuseReasonLabel(reason: RefuseReason): string {
  return REFUSE_REASON_JA[reason];
}

export function splitWorkLog(raw: string): string[] {
  return raw
    .split(/\r?\n|(?<=[。！？])/)
    .map((l) => l.trim())
    .filter((l) => l.length >= 4);
}

function normalizePhrase(line: string): string {
  return line
    .replace(/^[・\-–—\d\.\)\]]+\s*/, "")
    .replace(/[「」『』【】]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

function painScore(text: string): number {
  let score = 0;
  for (const signal of PAIN_SIGNALS) {
    if (text.includes(signal)) score += 2;
  }
  if (/(お客様|顧客|ユーザー|先方|相手)/.test(text)) score += 1;
  if (/(です|ます|だった|してしまった)/.test(text)) score += 1;
  return score;
}

function refuseCheck(phrase: string): RefuseReason | null {
  if (phrase.length < 5) return "too_short";
  for (const { reason, re } of REFUSE_PATTERNS) {
    if (re.test(phrase)) return reason;
  }
  return null;
}

/**
 * Extract pain candidates from a pasted work log (notes, tickets, chat).
 * Kept candidates must carry a pain signal; refuse rules are enforced here.
 */
export function extractPainFromWorkLog(raw: string): ExtractionResult {
  const lines = splitWorkLog(raw);
  const kept: PainCandidate[] = [];
  const refused: PainCandidate[] = [];
  const seen = new Set<string>();

  lines.forEach((line, sourceIndex) => {
    const phrase = normalizePhrase(line);
    const id = `p${sourceIndex}`;

    if (seen.has(phrase)) {
      refused.push({
        id,
        phrase,
        sourceLine: line,
        sourceIndex,
        score: 0,
        status: "refuse",
        reason: "duplicate",
      });
      return;
    }
    seen.add(phrase);

    const hardRefuse = refuseCheck(phrase);
    if (hardRefuse) {
      refused.push({
        id,
        phrase,
        sourceLine: line,
        sourceIndex,
        score: 0,
        status: "refuse",
        reason: hardRefuse,
      });
      return;
    }

    const score = painScore(phrase);
    if (score < 2) {
      refused.push({
        id,
        phrase,
        sourceLine: line,
        sourceIndex,
        score,
        status: "refuse",
        reason: "no_pain_signal",
      });
      return;
    }

    kept.push({
      id,
      phrase,
      sourceLine: line,
      sourceIndex,
      score,
      status: "keep",
    });
  });

  kept.sort((a, b) => b.score - a.score);

  return {
    kept: kept.slice(0, 12),
    refused,
    method: "local-heuristics-v1",
  };
}

export const SAMPLE_WORK_LOG = `【商談メモ 3/12】
顧客「去年転職して後悔した。周りは成功談ばかりで相談できない」
先方担当：入社後に評価制度が曖昧で、何をすればいいかわからないと言う。
比較検討の資料ください、という依頼は別件（今回は見送り）。

【問い合わせ #4821】
副業がバレたかもしれない。住民税の通知を見て動悸がした。
どう謝ればいいかわからず、今夜眠れない。

【社内共有】
資金ショートの兆候を見逃した、という振り返り。
SEO対策の一般論を書くのはやめよう、と合意。

【サポートログ】
案件が切れて収入ゼロ。営業文が思いつかない。
おすすめランキングみたいな記事は求めていない、とのこと。`;

export type SeoCheck = {
  id: string;
  label: string;
  pass: boolean;
};

export function computeSeoChecks(input: {
  phrase: string;
  hasWhyNow: boolean;
  scarCount: number;
  forkCount: number;
  nextCount: number;
  hasSources: boolean;
}): SeoCheck[] {
  return [
    {
      id: "h1",
      label: `H1候補が検索語と一致（「${input.phrase}」）`,
      pass: input.phrase.trim().length >= 5,
    },
    {
      id: "why",
      label: "なぜ今（検索直後の心理）がある",
      pass: input.hasWhyNow,
    },
    {
      id: "scars",
      label: "先に痛い事実が3件以上",
      pass: input.scarCount >= 3,
    },
    {
      id: "forks",
      label: "分岐点が2件以上",
      pass: input.forkCount >= 2,
    },
    {
      id: "next",
      label: "今夜の一手がある",
      pass: input.nextCount >= 1,
    },
    {
      id: "source",
      label: "仕事ログの出典行が紐づいている",
      pass: input.hasSources,
    },
  ];
}
