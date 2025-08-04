"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Zap, MessageSquare, Activity, Plus, ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalChatbots: number
  activeChatbots: number
  totalAgents: number
  activeAgents: number
  totalConversations: number
  totalMessages: number
}

interface RecentItem {
  id: string
  name: string
  status: "active" | "inactive" | "draft"
  createdAt: string
  type: "chatbot" | "agent"
}

interface ActivityLog {
  id: string
  type: "execution" | "conversation" | "system"
  status: "completed" | "failed" | "running"
  message: string
  timestamp: string
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalChatbots: 0,
    activeChatbots: 0,
    totalAgents: 0,
    activeAgents: 0,
    totalConversations: 0,
    totalMessages: 0,
  })
  const [recentItems, setRecentItems] = useState<RecentItem[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Mock data - in real app, fetch from API
      setStats({
        totalChatbots: 12,
        activeChatbots: 8,
        totalAgents: 5,
        activeAgents: 3,
        totalConversations: 1247,
        totalMessages: 8934,
      })

      setRecentItems([
        {
          id: "1",
          name: "Customer Support Bot",
          status: "active",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: "chatbot",
        },
        {
          id: "2",
          name: "Daily Report Agent",
          status: "active",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          type: "agent",
        },
        {
          id: "3",
          name: "FAQ Assistant",
          status: "draft",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          type: "chatbot",
        },
      ])

      setRecentActivity([
        {
          id: "1",
          type: "execution",
          status: "completed",
          message: "Daily Report Agent executed successfully",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          type: "conversation",
          status: "completed",
          message: "Customer Support Bot handled 15 conversations",
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          type: "system",
          status: "running",
          message: "System health check in progress",
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
      ])
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      case "completed":
        return <Badge className="status-active">Completed</Badge>
      case "failed":
        return <Badge className="status-error">Failed</Badge>
      case "running":
        return <Badge className="status-processing">Running</Badge>
      default:
        return <Badge className="status-inactive">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="hud-card">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-primary/20 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-primary/20 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neon-text font-mono">NEURAL CORE</h1>
          <p className="text-muted-foreground font-mono">
            Welcome back! Here's what's happening with your AI assistants.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild className="hud-button-primary font-mono">
            <Link href="/dashboard/chatbots/create">
              <Plus className="mr-2 h-4 w-4" />
              NEW CHATBOT
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hud-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono">TOTAL CHATBOTS</CardTitle>
            <Bot className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold neon-text font-mono">{stats.totalChatbots}</div>
            <p className="text-xs text-muted-foreground font-mono">{stats.activeChatbots} active</p>
          </CardContent>
        </Card>

        <Card className="hud-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono">TOTAL AGENTS</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold neon-text-accent font-mono">{stats.totalAgents}</div>
            <p className="text-xs text-muted-foreground font-mono">{stats.activeAgents} active</p>
          </CardContent>
        </Card>

        <Card className="hud-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono">CONVERSATIONS</CardTitle>
            <MessageSquare className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold neon-text-success font-mono">
              {stats.totalConversations.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground font-mono">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="hud-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono">MESSAGES</CardTitle>
            <Activity className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning font-mono">{stats.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground font-mono">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <Card className="hud-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-mono neon-text">RECENT DEPLOYMENTS</CardTitle>
              <Button variant="ghost" size="sm" asChild className="hud-button font-mono">
                <Link href="/dashboard/chatbots">
                  VIEW ALL
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <CardDescription className="font-mono">Your latest AI assistants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentItems.length > 0 ? (
                recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        {item.type === "chatbot" ? (
                          <Bot className="h-4 w-4 text-primary" />
                        ) : (
                          <Zap className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium font-mono">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground font-mono">No deployments yet</p>
                  <Button size="sm" className="mt-2 hud-button-primary font-mono" asChild>
                    <Link href="/dashboard/chatbots/create">Create your first chatbot</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hud-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-mono neon-text">NEURAL ACTIVITY</CardTitle>
              <Button variant="ghost" size="sm" asChild className="hud-button font-mono">
                <Link href="/dashboard/logs">
                  VIEW LOGS
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <CardDescription className="font-mono">Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-3 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {activity.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : activity.status === "failed" ? (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <Clock className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium font-mono">{activity.message}</p>
                      <p className="text-xs text-muted-foreground font-mono">{formatDate(activity.timestamp)}</p>
                    </div>
                    {getStatusBadge(activity.status)}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground font-mono">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
