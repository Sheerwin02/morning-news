export type LayoutOption = "3x2" | "2x4" | "1x6"

export interface FeedData {
  id: string
  name: string
  url: string
  category: "news" | "tech" | "other"
}

export interface Article {
  title: string
  link: string
  pubDate: string
  content?: string
}

