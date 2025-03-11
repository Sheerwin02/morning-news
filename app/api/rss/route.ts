import { type NextRequest, NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"
import type { Article } from "@/lib/types"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch RSS feed: ${response.statusText}` },
        { status: response.status },
      )
    }

    const xml = await response.text()
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    })

    const result = parser.parse(xml)
    const channel = result.rss?.channel || result.feed

    if (!channel) {
      return NextResponse.json({ error: "Invalid RSS format" }, { status: 400 })
    }

    // Handle different RSS formats
    let items = channel.item || channel.entry || []
    if (!Array.isArray(items)) {
      items = [items]
    }

    const articles: Article[] = items.map((item: any) => {
      // Handle different date formats
      const pubDate = item.pubDate || item.published || item.updated || new Date().toISOString()

      return {
        title: item.title?.["#text"] || item.title || "No title",
        link: item.link?.["@_href"] || item.link || "#",
        pubDate: pubDate,
        content: item.description || item.content || item["content:encoded"] || "",
      }
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error parsing RSS feed:", error)
    return NextResponse.json({ error: "Failed to parse RSS feed" }, { status: 500 })
  }
}

