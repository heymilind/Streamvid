"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const categories = [
  { id: "all", name: "All", active: true },
  { id: "gaming", name: "Gaming" },
  { id: "music", name: "Music" },
  { id: "live", name: "Live" },
  { id: "news", name: "News" },
  { id: "sports", name: "Sports" },
  { id: "learning", name: "Learning" },
  { id: "fashion", name: "Fashion & Beauty" },
  { id: "podcasts", name: "Podcasts" },
  { id: "travel", name: "Travel" },
  { id: "cooking", name: "Cooking" },
  { id: "technology", name: "Technology" },
  { id: "fitness", name: "Fitness" },
  { id: "comedy", name: "Comedy" },
  { id: "entertainment", name: "Entertainment" },
]

export default function CategoryFilters() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="flex items-center px-6 py-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={
                activeCategory === category.id
                  ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 whitespace-nowrap px-4 py-2 border border-zinc-300"
                  : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 whitespace-nowrap px-4 py-2"
              }
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
