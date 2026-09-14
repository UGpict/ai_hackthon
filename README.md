# きずあと (Kizuato)

原体験の塊みたいな辛さを、検索で薄める SEO プロダクト。

人が本気で検索するのは痛い瞬間だけ。その検索意図のど真ん中に「先に痛い事実」を置き、自分が全部背負う前に分岐点と次の一手を渡す。

## いまあるもの

- LP（ブランド / なぜ SEO か / ページの型）
- `/kizu` 索引（検索・カテゴリ）
- `/kizu/[slug]` プログラム的 SEO ページ（JSON-LD Article + FAQ）
- `sitemap.xml` / `robots.txt`

## 開発

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## コンテンツ追加

`src/lib/pains.ts` に痛みエントリを足すと、静的ページ・sitemap・関連リンクが追従する。
