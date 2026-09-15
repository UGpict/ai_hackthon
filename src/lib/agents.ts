export type AgentId = "mitsu" | "hani" | "comu";

export type AgentProfile = {
  id: AgentId;
  name: string;
  role: string;
  job: string;
  workingForYou: string;
  color: string;
  portrait: string;
};

export const agents: AgentProfile[] = [
  {
    id: "mitsu",
    name: "ミツ",
    role: "Nectar Scout",
    job: "痛い検索語の蜜を集めてくる",
    workingForYou:
      "SERPの深夜帯から“いま痛い”クエリを蜜として運ぶ",
    color: "#5ec8ff",
    portrait: "/agents/mitsu.png",
  },
  {
    id: "hani",
    name: "ハニ",
    role: "Honey Carver",
    job: "集めた蜜を濃い事実に煮詰める",
    workingForYou:
      "原体験の塊を削って、分岐点と今夜の一手だけ残す",
    color: "#ffb020",
    portrait: "/agents/hani.png",
  },
  {
    id: "comu",
    name: "コム",
    role: "Comb Closer",
    job: "良さげなセルを光らせてSEOで閉じる",
    workingForYou:
      "FAQ・内部リンク・H1一致で、光るセルを検索に通す",
    color: "#ffe08a",
    portrait: "/agents/comu.png",
  },
];

export function getAgent(id: AgentId): AgentProfile {
  const agent = agents.find((a) => a.id === id);
  if (!agent) throw new Error(`Unknown agent: ${id}`);
  return agent;
}

export type AgentStep = {
  agentId: AgentId;
  label: string;
  detail: string;
  ms: number;
  /** Honeycomb cell updates during this step */
  cells?: HoneyCellUpdate[];
};

export type HoneyCellState = "empty" | "incoming" | "candidate" | "lit" | "dim";

export type HoneyCell = {
  id: string;
  label: string;
  state: HoneyCellState;
};

export type HoneyCellUpdate = {
  id: string;
  label?: string;
  state: HoneyCellState;
};

export type ScarDraft = {
  query: string;
  slug: string;
  lead: string;
  whyNow: string;
  scars: string[];
  forks: string[];
  next: string[];
  also: string[];
  seoNotes: string[];
  /** Provenance: work-log lines that justified this draft */
  sources: { phrase: string; sourceLine: string }[];
};

export function initialHoneycomb(query: string): HoneyCell[] {
  const q = query.trim() || "転職して後悔した";
  const seeds = [
    q,
    `${q} サイン`,
    `${q} 対処`,
    "関連検索A",
    "関連検索B",
    "一般論ノイズ",
    "精神論",
    "今夜の一手",
    "分岐点",
    "FAQ案",
    "内部リンク",
    "H1一致",
  ];

  return seeds.map((label, i) => ({
    id: `c${i}`,
    label: i === 0 ? label : "···",
    state: "empty" as const,
  }));
}

/** Deterministic local bee pipeline — work-log nectar in, approved cells light up. */
export function buildAgentRun(
  query: string,
  approved: { phrase: string; sourceLine: string }[] = [],
): {
  steps: AgentStep[];
  draft: ScarDraft;
  highlightIds: string[];
} {
  const q = query.trim() || approved[0]?.phrase || "転職して後悔した";
  const slug = slugify(q);

  const steps: AgentStep[] = [
    {
      agentId: "mitsu",
      label: "痛いSERPを偵察",
      detail: `「${q}」の検索意図を蜜としてロックオン`,
      ms: 350,
      cells: [
        { id: "c0", label: q, state: "incoming" },
        { id: "c1", label: `${q.slice(0, 10)} サイン`, state: "incoming" },
        { id: "c2", label: `${q.slice(0, 10)} 対処`, state: "incoming" },
      ],
    },
    {
      agentId: "mitsu",
      label: "競合枠をハニカムへ運ぶ",
      detail: "まとめ記事・掲示板・一般論の位置をセル化",
      ms: 280,
      cells: [
        { id: "c0", state: "candidate" },
        { id: "c1", state: "candidate" },
        { id: "c2", state: "candidate" },
        { id: "c3", label: "まとめ記事枠", state: "incoming" },
        { id: "c4", label: "掲示板枠", state: "incoming" },
      ],
    },
    {
      agentId: "hani",
      label: "一般論を落とす",
      detail: "比較・事典・精神論は dim。痛い入口だけ残す",
      ms: 320,
      cells: [
        { id: "c5", label: "一般論", state: "dim" },
        { id: "c6", label: "比較検討", state: "dim" },
        { id: "c3", state: "dim" },
        { id: "c4", state: "candidate" },
      ],
    },
    {
      agentId: "hani",
      label: "占領用の中身を煮詰める",
      detail: "先に痛い事実と今夜の一手に濃縮",
      ms: 320,
      cells: [
        { id: "c7", label: "今夜の一手", state: "candidate" },
        { id: "c8", label: "分岐点", state: "candidate" },
        { id: "c0", state: "candidate" },
      ],
    },
    {
      agentId: "comu",
      label: "#1枠を光らせる",
      detail: "勝ち筋のセルだけ lit。ここが占領ポイント",
      ms: 280,
      cells: [
        { id: "c0", state: "lit" },
        { id: "c7", state: "lit" },
        { id: "c8", state: "lit" },
        { id: "c1", state: "lit" },
      ],
    },
    {
      agentId: "comu",
      label: "SERPを閉じる",
      detail: "H1一致・FAQ・内部リンクで1位を固定",
      ms: 280,
      cells: [
        { id: "c9", label: "FAQ", state: "lit" },
        { id: "c10", label: "内部リンク", state: "lit" },
        { id: "c11", label: "H1一致", state: "lit" },
      ],
    },
  ];

  return {
    steps,
    draft: craftDraft(q, slug, approved),
    highlightIds: ["c0", "c1", "c7", "c8", "c9", "c10", "c11"],
  };
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}-]+/gu, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "pain-query"
  );
}

function craftDraft(
  query: string,
  slug: string,
  approved: { phrase: string; sourceLine: string }[] = [],
): ScarDraft {
  const also = [`${query} 対処`, `${query} サイン`, `${query} 次にやること`];
  const sources =
    approved.length > 0
      ? approved.slice(0, 5)
      : [{ phrase: query, sourceLine: "（手打ち。仕事ログ出典なし）" }];

  return {
    query,
    slug,
    lead: `「${query}」で検索した瞬間の辛さを、原体験の塊のままにしない。`,
    whyNow: `この語で検索する人は、すでに痛みの只中か、その直前にいる。答えより先に、自分が何を見落としているかを確かめたい。`,
    scars: [
      `「${query}」の本当のコストは、出来事そのものより、判断を先延ばしにした期間に溜まる。`,
      "周囲の一般論は、いまの分岐点をぼかすノイズになりやすい。",
      "身体の反応（眠れない／胃が重い／比較が止まらない）は、言葉より先に出るシグナルだった。",
      "同じ検索をしている人は多い。孤独は事実ではなく、情報が届いていないだけ、のことが多い。",
    ],
    forks: [
      "大きな決断の前に、事実／解釈／感情を1枚に分けて書く習慣を入れる。",
      "相談相手を増やす前に、自分の求める結果を一文で固定する。",
      "動けない日は、情報収集を止め、今夜の一手を1つだけ残す。",
    ],
    next: [
      `「${query}」に至る直近の出来事を、時系列で5行だけ書く。`,
      "変えたい状態を1文にし、今日やらないことを1つ決める。",
      "次に開くページ／人／窓口を1つだけ選んで、タブを閉じる。",
    ],
    also,
    seoNotes: [
      `H1は検索語「${query}」と一致させる`,
      "FAQを3問（なぜ今／先に痛い事実／今夜の一手）で構造化",
      "関連きずあとへの内部リンクを最低2本",
      "title: 「検索語｜先に痛い事実」形式でクリック意図を明確化",
    ],
    sources,
  };
}

export type LiveActivity = {
  id: string;
  agentId: AgentId;
  text: string;
  ago: string;
};

export const liveFeed: LiveActivity[] = [
  {
    id: "1",
    agentId: "mitsu",
    text: "「副業 バレた」の蜜をハニカムへ搬入中",
    ago: "38秒前",
  },
  {
    id: "2",
    agentId: "hani",
    text: "資金ショートのセルを煮詰めて1行だけ残した",
    ago: "2分前",
  },
  {
    id: "3",
    agentId: "comu",
    text: "転職後悔→退職後不安のセルをつないで光らせた",
    ago: "4分前",
  },
  {
    id: "4",
    agentId: "mitsu",
    text: "深夜帯『婚活 疲れ』の蜜が濃くなってきた",
    ago: "7分前",
  },
  {
    id: "5",
    agentId: "comu",
    text: "パワハラ証拠セルのFAQを縫い直し",
    ago: "11分前",
  },
  {
    id: "6",
    agentId: "hani",
    text: "案件切れの『今夜の一手』を食べやすい粒度に圧縮",
    ago: "16分前",
  },
];
