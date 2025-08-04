"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Bot,
  Plus,
  Search,
  MoreHorizontal,
  Settings,
  Trash2,
  ExternalLink,
  Copy,
  Play,
  Pause,
  BarChart3,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ChatbotTestDialog } from "./chatbot-test-dialog"

interface Chatbot {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "draft"
  provider: string
  model: string
  createdAt: string
  conversations: number
  knowledgeBase: string[]
  tools: string[]
}

export function ChatbotDashboard() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [filteredChatbots, setFilteredChatbots] = useState<Chatbot[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [testChatbot, setTestChatbot] = useState<Chatbot | null>(null)
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchChatbots()
  }, [])

  useEffect(() => {
    const filtered = chatbots.filter(
      (chatbot) =>
        chatbot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chatbot.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredChatbots(filtered)
  }, [chatbots, searchTerm])

  const fetchChatbots = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockChatbots: Chatbot[] = [
        {
          id: "1",
          name: "Customer Support Bot",
          description: "Handles customer inquiries and support tickets",
          status: "active",
          provider: "OpenAI",
          model: "gpt-4o",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          conversations: 1247,
          knowledgeBase: ["support-docs.pdf", "faq.md"],
          tools: ["web_search", "ticket_creator"],
        },
        {
          id: "2",
          name: "Sales Assistant",
          description: "Helps with product recommendations and sales inquiries",
          status: "active",
          provider: "Anthropic",
          model: "claude-3-sonnet",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          conversations: 892,
          knowledgeBase: ["product-catalog.pdf"],
          tools: ["calculator"],
        },
        {
          id: "3",
          name: "FAQ Assistant",
          description: "Answers frequently asked questions",
          status: "draft",
          provider: "OpenAI",
          model: "gpt-3.5-turbo",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          conversations: 0,
          knowledgeBase: ["faq.md"],
          tools: [],
        },
      ]
      setChatbots(mockChatbots)
    } catch (error) {
      console.error("Failed to fetch chatbots:", error)
      toast({
        title: "Error",
        description: "Failed to load chatbots",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    try {
      setChatbots((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus as any } : c)))
      toast({
        title: "Success",
        description: `Chatbot ${newStatus === "active" ? "activated" : "deactivated"}`,
      })
    } catch (error) {
      console.error("Failed to update chatbot status:", error)
      toast({
        title: "Error",
        description: "Failed to update chatbot status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chatbot?")) return

    try {
      setChatbots((prev) => prev.filter((c) => c.id !== id))
      toast({
        title: "Success",
        description: "Chatbot deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete chatbot:", error)
      toast({
        title: "Error",
        description: "Failed to delete chatbot",
        variant: "destructive",
      })
    }
  }

  const copyEmbedCode = (chatbotId: string) => {
    const embedCode = `<script src="${window.location.origin}/embed/${chatbotId}.js"></script>`
    navigator.clipboard.writeText(embedCode)
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard",
    })
  }

  const openTestDialog = (chatbot: Chatbot) => {
    setTestChatbot(chatbot)
    setIsTestDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="status-active">Active</Badge>
      case "inactive":
        return <Badge className="status-inactive">Inactive</Badge>
      case "draft":
        return <Badge className="status-warning">Draft</Badge>
      default:
        return <Badge className="status-inactive">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight neon-text font-mono">CHATBOTS</h1>
            <p className="text-muted-foreground font-mono">Manage your AI chatbots</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="hud-card">
              <CardHeader>
                <div className="h-4 bg-primary/20 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-primary/20 rounded w-48 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-primary/20 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neon-text font-mono">CHATBOTS</h1>
          <p className="text-muted-foreground font-mono">Create and manage your AI chatbots</p>
        </div>
        <Button asChild className="hud-button-primary font-mono">
          <Link href="/dashboard/chatbots/create">
            <Plus className="mr-2 h-4 w-4" />
            CREATE CHATBOT
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
        <Input
          placeholder="Search chatbots..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 hud-input font-mono"
        />
      </div>

      {filteredChatbots.length === 0 && !searchTerm ? (
        <Card className="hud-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2 font-mono">No chatbots yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm font-mono">
              Get started by creating your first AI chatbot. You can train it with your own data and customize its
              behavior.
            </p>
            <Button asChild className="hud-button-primary font-mono">
              <Link href="/dashboard/chatbots/create">
                <Plus className="mr-2 h-4 w-4" />
                CREATE YOUR FIRST CHATBOT
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : filteredChatbots.length === 0 ? (
        <Card className="hud-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2 font-mono">No results found</h3>
            <p className="text-muted-foreground text-center font-mono">
              Try adjusting your search terms or create a new chatbot.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChatbots.map((chatbot) => (
            <Card key={chatbot.id} className="hud-card hover:scale-105 transition-transform duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-mono neon-text">{chatbot.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hud-button">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dropdown-content">
                      <DropdownMenuItem onClick={() => openTestDialog(chatbot)} className="dropdown-item font-mono">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Test Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="dropdown-item font-mono">
                        <Link href={`/dashboard/chatbots/${chatbot.id}/edit`}>
                          <Settings className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="dropdown-item font-mono">
                        <Link href={`/chat/${chatbot.id}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open Chat
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyEmbedCode(chatbot.id)} className="dropdown-item font-mono">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Embed Code
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="dropdown-item font-mono">
                        <Link href={`/dashboard/analytics?chatbotId=${chatbot.id}`}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Analytics
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusToggle(chatbot.id, chatbot.status)}
                        className="dropdown-item font-mono"
                      >
                        {chatbot.status === "active" ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(chatbot.id)}
                        className="dropdown-item text-destructive font-mono"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2 font-mono">{chatbot.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {getStatusBadge(chatbot.status)}
                  <span className="text-sm text-muted-foreground font-mono">{chatbot.provider}</span>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span className="font-mono">Model:</span>
                    <span className="font-medium font-mono text-primary">{chatbot.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">Conversations:</span>
                    <span className="font-medium font-mono text-success">{chatbot.conversations.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">Knowledge Base:</span>
                    <span className="font-medium font-mono text-accent">{chatbot.knowledgeBase.length} files</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">Tools:</span>
                    <span className="font-medium font-mono text-warning">{chatbot.tools.length} tools</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-primary/20">
                  <p className="text-xs text-muted-foreground font-mono">Created {formatDate(chatbot.createdAt)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ChatbotTestDialog chatbot={testChatbot} open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen} />
    </div>
  )
}
