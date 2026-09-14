export type SerpRival = {
  title: string;
  url: string;
  snippet: string;
  kind: "generic" | "forum" | "media";
};

export type SerpRaidPlan = {
  query: string;
  intent: string;
  yourTitle: string;
  yourSnippet: string;
  rivals: SerpRival[];
  occupiedLabel: string;
};

/** Deterministic fake SERP for the raid demo — the thrill of taking slot #1. */
export function buildSerpRaid(query: string): SerpRaidPlan {
  const q = query.trim() || "転職して後悔した";

  return {
    query: q,
    intent: "痛みの只中。比較ではなく、いま何を見落としているかを探している",
    yourTitle: `${q}｜先に痛い事実ときょうの一手`,
    yourSnippet: `「${q}」で検索した夜に読む。一般論ではなく、分岐点と今夜動ける一手だけ。`,
    rivals: [
      {
        kind: "media",
        title: `${q}ときの対処法まとめ【保存版】`,
        url: "media.example.com/guide",
        snippet: "専門家が教える一般的なポイントを一覧で解説します…",
      },
      {
        kind: "forum",
        title: `【相談】${q}んですがどうすれば`,
        url: "bbs.example.com/thread/1842",
        snippet: "共感コメントが並ぶスレ。結論は散らばったまま…",
      },
      {
        kind: "generic",
        title: `知っておきたい${q}前のチェックリスト`,
        url: "blog.example.com/checklist",
        snippet: "準備・比較・心構え。痛い瞬間の検索意図とはズレている…",
      },
    ],
    occupiedLabel: `「${q}」のSERPを占領`,
  };
}
