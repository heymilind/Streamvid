import MainHeader from "@/components/main-header"
import CategoryFilters from "@/components/category-filters"
import VideoGrid from "@/components/video-grid"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <MainHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <CategoryFilters />
        </div>

        <VideoGrid />
      </main>
    </div>
  )
}
