"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Download,
  Share2,
  Trash2,
  Edit,
  Eye,
  Grid,
  List,
  Calendar,
  Image as ImageIcon,
  MoreVertical,
  Star,
  Copy
} from "lucide-react"

interface ContentItem {
  id: string
  title: string
  prompt: string
  imageUrl: string
  createdAt: string
  status: "completed" | "processing" | "failed"
  quality: "standard" | "high" | "ultra"
  style: string
  tags: string[]
  views: number
  downloads: number
  rating?: number
}

export default function Library() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Mock data
  const contentItems: ContentItem[] = [
    {
      id: "1",
      title: "Sunset Landscape",
      prompt: "Beautiful sunset over mountains with golden hour lighting",
      imageUrl: "/api/placeholder/400/400",
      createdAt: "2024-01-15T10:00:00Z",
      status: "completed",
      quality: "high",
      style: "photorealistic",
      tags: ["landscape", "sunset", "nature"],
      views: 234,
      downloads: 45,
      rating: 4.5
    },
    {
      id: "2",
      title: "Abstract Art",
      prompt: "Colorful abstract composition with geometric shapes",
      imageUrl: "/api/placeholder/400/400",
      createdAt: "2024-01-14T15:30:00Z",
      status: "completed",
      quality: "standard",
      style: "abstract",
      tags: ["abstract", "colorful", "geometric"],
      views: 156,
      downloads: 23,
      rating: 4.0
    },
    {
      id: "3",
      title: "Product Shot",
      prompt: "Minimalist product photography with soft lighting",
      imageUrl: "/api/placeholder/400/400",
      createdAt: "2024-01-14T09:15:00Z",
      status: "completed",
      quality: "ultra",
      style: "commercial",
      tags: ["product", "minimalist", "photography"],
      views: 312,
      downloads: 67,
      rating: 5.0
    },
    {
      id: "4",
      title: "Character Design",
      prompt: "Fantasy character with detailed armor and weapons",
      imageUrl: "/api/placeholder/400/400",
      createdAt: "2024-01-13T14:20:00Z",
      status: "processing",
      quality: "high",
      style: "fantasy",
      tags: ["character", "fantasy", "concept"],
      views: 89,
      downloads: 12,
    },
    {
      id: "5",
      title: "Urban Architecture",
      prompt: "Modern cityscape with futuristic buildings",
      imageUrl: "/api/placeholder/400/400",
      createdAt: "2024-01-13T11:45:00Z",
      status: "completed",
      quality: "high",
      style: "architectural",
      tags: ["architecture", "urban", "futuristic"],
      views: 445,
      downloads: 89,
      rating: 4.8
    },
    {
      id: "6",
      title: "Food Photography",
      prompt: "Gourmet dish with artistic plating",
      imageUrl: "/api/placeholder/400/400",
      createdAt: "2024-01-12T16:00:00Z",
      status: "completed",
      quality: "standard",
      style: "food",
      tags: ["food", "photography", "gourmet"],
      views: 178,
      downloads: 34,
      rating: 4.2
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const ContentCard = ({ item }: { item: ContentItem }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
        <ImageIcon className="absolute inset-0 m-auto h-12 w-12 text-gray-400" />
        {item.status === "processing" && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="secondary">Processing...</Badge>
          </div>
        )}
        {item.status === "failed" && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Failed</Badge>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        {item.rating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black bg-opacity-70 text-white px-2 py-1 rounded">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs">{item.rating}</span>
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{item.title}</CardTitle>
        <CardDescription className="text-xs line-clamp-2">
          {item.prompt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs">
            {item.style}
          </Badge>
          <Badge variant={item.quality === "ultra" ? "default" : item.quality === "high" ? "secondary" : "outline"} className="text-xs">
            {item.quality}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(item.createdAt)}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {item.views}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {item.downloads}
            </span>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Copy className="mr-1 h-3 w-3" />
            Duplicate
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const ContentListItem = ({ item }: { item: ContentItem }) => (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-1">{item.prompt}</p>
            </div>
            <div className="flex items-center gap-2">
              {item.status === "completed" && (
                <Badge variant="outline" className="text-xs">Completed</Badge>
              )}
              {item.status === "processing" && (
                <Badge variant="secondary" className="text-xs">Processing</Badge>
              )}
              {item.status === "failed" && (
                <Badge variant="destructive" className="text-xs">Failed</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{formatDate(item.createdAt)}</span>
            <span>{item.style}</span>
            <span>{item.quality} quality</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {item.views}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {item.downloads}
            </span>
            {item.rating && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {item.rating}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
          <p className="text-muted-foreground">Manage and organize your generated content</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2 GB</div>
              <p className="text-xs text-muted-foreground">of 100 GB</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,456</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Quality Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.6</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentItems.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {contentItems.map((item) => (
                  <ContentListItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentItems
                  .filter((item) => item.status === "completed")
                  .map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {contentItems
                  .filter((item) => item.status === "completed")
                  .map((item) => (
                    <ContentListItem key={item.id} item={item} />
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-gray-500">1 item currently processing</p>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-gray-500">No favorites yet</p>
              <Button className="mt-4" variant="outline">
                Browse Content
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="shared" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-gray-500">No shared content</p>
              <Button className="mt-4" variant="outline">
                Share Your First Item
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}