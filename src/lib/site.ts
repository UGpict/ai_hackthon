export const SITE = {
  name: "きずあと",
  nameEn: "Kizuato",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kizuato.app",
  tagline: "仕事ログの痛み言葉を、Pain SERPで光らせる",
  description:
    "きずあとは業務改善ツールではない。商談・問い合わせログから顧客の痛み言葉を抜き、人が採用したセルだけを検索結果へ刺すSEOハックだ。",
} as const;
