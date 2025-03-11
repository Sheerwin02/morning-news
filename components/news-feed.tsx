"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, ExternalLink, RefreshCw, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import type { FeedData, Article } from "@/lib/types"
import { fetchRssFeed } from "@/lib/rss-parser"
import { formatTimeAgo } from "@/lib/utils"

interface NewsFeedProps {
  feed: FeedData
  articlesPerFeed: number
  onRemove: () => void
}

export function NewsFeed({ feed, articlesPerFeed, onRemove }: NewsFeedProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeed = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchRssFeed(feed.url)
      setArticles(data.slice(0, articlesPerFeed))
    } catch (err) {
      setError("Failed to load feed. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [feed.url, articlesPerFeed])

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{feed.name}</CardTitle>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fetchFeed} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onRemove} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove feed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchFeed}>
              Try Again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: articlesPerFeed }).map((_, i) => (
              <div key={i} className="flex justify-between items-start py-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[15%]" />
              </div>
            ))}
          </div>
        ) : (
          <ul className="divide-y">
            {articles.map((article, index) => (
              <li key={index} className="flex justify-between items-start p-4 hover:bg-muted/50">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline flex-1 mr-2"
                >
                  {article.title}
                </a>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(article.pubDate)}
                  </span>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="sr-only">Open article</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

