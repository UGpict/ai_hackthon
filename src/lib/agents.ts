export type AgentId = "saguri" | "kezuri" | "toji";

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
    id: "saguri",
    name: "サグリ",
    role: "Intent Scout",
    job: "痛い検索語と検索意図を掘る",
    workingForYou:
      "SERPの深夜帯クエリを拾い、原体験が固まりかけている入口を見つける",
    color: "#5ec8ff",
    portrait: "/agents/saguri.png",
  },
  {
    id: "kezuri",
    name: "ケズリ",
    role: "Scar Carver",
    job: "原体験の塊を薄い事実に削る",
    workingForYou:
      "精神論を捨て、分岐点と今夜の一手だけが残るまで文章を削る",
    color: "#ff4d2e",
    portrait: "/agents/kezuri.png",
  },
  {
    id: "toji",
    name: "トジ",
    role: "Rank Closer",
    job: "FAQ・内部リンク・索引で閉じる",
    workingForYou:
      "検索で勝ち切る形に縫い、関連する傷どうしをつなぐ",
    color: "#c9f27a",
    portrait: "/agents/toji.png",
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
};

/** Deterministic local agent pipeline — visualizes crew working without external LLM. */
export function buildAgentRun(query: string): {
  steps: AgentStep[];
  draft: ScarDraft;
} {
  const q = query.trim() || "転職して後悔した";
  const slug = slugify(q);

  const steps: AgentStep[] = [
    {
      agentId: "saguri",
      label: "検索意図を分解",
      detail: `「${q}」の裏にある“いま痛い理由”を切り出す`,
      ms: 700,
    },
    {
      agentId: "saguri",
      label: "共起クエリを拾う",
      detail: "People Also Ask / 関連検索から入口語を3つ確保",
      ms: 900,
    },
    {
      agentId: "kezuri",
      label: "原体験を削る",
      detail: "感情の塊を、先に痛い事実4行に圧縮",
      ms: 1100,
    },
    {
      agentId: "kezuri",
      label: "分岐点を残す",
      detail: "戻りたかった選択だけを3本に残す",
      ms: 800,
    },
    {
      agentId: "toji",
      label: "今夜の一手を固定",
      detail: "検索直後に動ける行動を3つに縫う",
      ms: 700,
    },
    {
      agentId: "toji",
      label: "SEOで閉じる",
      detail: "H1一致・FAQ候補・内部リンク案を添える",
      ms: 900,
    },
  ];

  const draft = craftDraft(q, slug);
  return { steps, draft };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "pain-query";
}

function craftDraft(query: string, slug: string): ScarDraft {
  const also = [
    `${query} 対処`,
    `${query} サイン`,
    `${query} 次にやること`,
  ];

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
  };
}

export type LiveActivity = {
  id: string;
  agentId: AgentId;
  text: string;
  ago: string;
};

/** Demo feed: always-on sense that the crew is working for you. */
export const liveFeed: LiveActivity[] = [
  {
    id: "1",
    agentId: "saguri",
    text: "「副業 バレた」周辺の関連検索を再スキャン",
    ago: "38秒前",
  },
  {
    id: "2",
    agentId: "kezuri",
    text: "資金ショート頁の『先に痛い事実』を1行削って鋭利化",
    ago: "2分前",
  },
  {
    id: "3",
    agentId: "toji",
    text: "転職後悔 → 退職後不安 の内部リンクを縫い直し",
    ago: "4分前",
  },
  {
    id: "4",
    agentId: "saguri",
    text: "深夜帯の『婚活 疲れ』クエリ上昇を検知",
    ago: "7分前",
  },
  {
    id: "5",
    agentId: "toji",
    text: "パワハラ証拠ページのFAQスキーマを検証",
    ago: "11分前",
  },
  {
    id: "6",
    agentId: "kezuri",
    text: "案件切れ頁の『今夜の一手』を行動可能な粒度に再圧縮",
    ago: "16分前",
  },
];
