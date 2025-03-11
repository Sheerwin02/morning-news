import { v4 as uuidv4 } from "uuid"
import type { FeedData } from "./types"

export const defaultFeeds: FeedData[] = [
  {
    id: uuidv4(),
    name: "New York Times",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    category: "news",
  },
  {
    id: uuidv4(),
    name: "The Guardian",
    url: "https://feeds.theguardian.com/theguardian/world/rss",
    category: "news",
  },
  {
    id: uuidv4(),
    name: "Facebook Engineering",
    url: "https://engineering.fb.com/feed/",
    category: "tech",
  },
  {
    id: uuidv4(),
    name: "Cloudflare Blog",
    url: "https://blog.cloudflare.com/rss/",
    category: "tech",
  },
  {
    id: uuidv4(),
    name: "Stack Overflow Blog",
    url: "https://stackoverflow.blog/feed/",
    category: "tech",
  },
]

