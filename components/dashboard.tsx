"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Settings, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { NewsFeed } from "@/components/news-feed"
import { AddFeedDialog } from "@/components/add-feed-dialog"
import { SettingsDialog } from "@/components/settings-dialog"
import type { FeedData, LayoutOption } from "@/lib/types"
import { defaultFeeds } from "@/lib/default-feeds"

export default function Dashboard() {
  const { toast } = useToast()
  const [feeds, setFeeds] = useState<FeedData[]>([])
  const [isAddFeedOpen, setIsAddFeedOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [layout, setLayout] = useState<LayoutOption>("3x2")
  const [articlesPerFeed, setArticlesPerFeed] = useState(5)

  // Load feeds from localStorage on initial render
  useEffect(() => {
    const savedFeeds = localStorage.getItem("dashboard_feeds")
    const savedLayout = localStorage.getItem("dashboard_layout")
    const savedArticlesPerFeed = localStorage.getItem("dashboard_articles_per_feed")

    if (savedFeeds) {
      setFeeds(JSON.parse(savedFeeds))
    } else {
      setFeeds(defaultFeeds)
    }

    if (savedLayout) {
      setLayout(savedLayout as LayoutOption)
    }

    if (savedArticlesPerFeed) {
      setArticlesPerFeed(Number.parseInt(savedArticlesPerFeed))
    }
  }, [])

  // Save feeds to localStorage whenever they change
  useEffect(() => {
    if (feeds.length > 0) {
      localStorage.setItem("dashboard_feeds", JSON.stringify(feeds))
    }
  }, [feeds])

  // Save layout to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dashboard_layout", layout)
  }, [layout])

  // Save articlesPerFeed to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dashboard_articles_per_feed", articlesPerFeed.toString())
  }, [articlesPerFeed])

  const addFeed = (newFeed: FeedData) => {
    setFeeds([...feeds, newFeed])
    toast({
      title: "Feed added",
      description: `${newFeed.name} has been added to your dashboard.`,
    })
  }

  const removeFeed = (feedId: string) => {
    setFeeds(feeds.filter((feed) => feed.id !== feedId))
    toast({
      title: "Feed removed",
      description: "The feed has been removed from your dashboard.",
    })
  }

  const refreshAllFeeds = async () => {
    setIsLoading(true)
    // We're just simulating a refresh here
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Feeds refreshed",
        description: "All feeds have been updated with the latest content.",
      })
    }, 1000)
  }

  const updateSettings = (newLayout: LayoutOption, newArticlesPerFeed: number) => {
    setLayout(newLayout)
    setArticlesPerFeed(newArticlesPerFeed)
    toast({
      title: "Settings updated",
      description: "Your dashboard settings have been updated.",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Morning Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshAllFeeds} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" onClick={() => setIsAddFeedOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Feed
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Feeds</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="tech">Tech</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div
            className={`grid gap-6 ${
              layout === "3x2"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : layout === "2x4"
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
            }`}
          >
            {feeds.length > 0 ? (
              feeds.map((feed) => (
                <NewsFeed
                  key={feed.id}
                  feed={feed}
                  articlesPerFeed={articlesPerFeed}
                  onRemove={() => removeFeed(feed.id)}
                />
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p>No feeds added yet. Click "Add Feed" to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="news" className="mt-6">
          <div
            className={`grid gap-6 ${
              layout === "3x2"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : layout === "2x4"
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
            }`}
          >
            {feeds.filter((feed) => feed.category === "news").length > 0 ? (
              feeds
                .filter((feed) => feed.category === "news")
                .map((feed) => (
                  <NewsFeed
                    key={feed.id}
                    feed={feed}
                    articlesPerFeed={articlesPerFeed}
                    onRemove={() => removeFeed(feed.id)}
                  />
                ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p>No news feeds added yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="tech" className="mt-6">
          <div
            className={`grid gap-6 ${
              layout === "3x2"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : layout === "2x4"
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
            }`}
          >
            {feeds.filter((feed) => feed.category === "tech").length > 0 ? (
              feeds
                .filter((feed) => feed.category === "tech")
                .map((feed) => (
                  <NewsFeed
                    key={feed.id}
                    feed={feed}
                    articlesPerFeed={articlesPerFeed}
                    onRemove={() => removeFeed(feed.id)}
                  />
                ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p>No tech feeds added yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AddFeedDialog open={isAddFeedOpen} onOpenChange={setIsAddFeedOpen} onAddFeed={addFeed} />

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        currentLayout={layout}
        currentArticlesPerFeed={articlesPerFeed}
        onUpdateSettings={updateSettings}
      />
    </div>
  )
}

