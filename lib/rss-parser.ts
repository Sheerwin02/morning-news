import type { Article } from "./types"

export async function fetchRssFeed(url: string): Promise<Article[]> {
  try {
    const proxyUrl = `/api/rss?url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.articles
  } catch (error) {
    console.error("Error fetching RSS feed:", error)
    throw error
  }
}

