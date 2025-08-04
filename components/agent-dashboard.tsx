"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Zap, Plus, MoreHorizontal, Play, Pause, Settings, Trash2, Clock, Activity } from "lucide-react"
import Link from "next/link"
import type { Agent } from "@/lib/types"
import { getStatusColor, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export function AgentDashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents")
      if (response.ok) {
        const data = await response.json()
        setAgents(data)
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error)
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    try {
      const response = await fetch(`/api/agents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus as any } : a)))
        toast({
          title: "Success",
          description: `Agent ${newStatus === "active" ? "activated" : "deactivated"}`,
        })
      }
    } catch (error) {
      console.error("Failed to update agent status:", error)
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      })
    }
  }

  const handleExecute = async (id: string) => {
    try {
      const response = await fetch(`/api/agents/${id}/execute`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Agent execution started",
        })
      }
    } catch (error) {
      console.error("Failed to execute agent:", error)
      toast({
        title: "Error",
        description: "Failed to execute agent",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      const response = await fetch(`/api/agents/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAgents((prev) => prev.filter((a) => a.id !== id))
        toast({
          title: "Success",
          description: "Agent deleted successfully",
        })
      }
    } catch (error) {
      console.error("Failed to delete agent:", error)
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
            <p className="text-muted-foreground">Manage your AI agents</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">Create and manage your autonomous AI agents</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/agents/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Agent
          </Link>
        </Button>
      </div>

      {agents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No agents yet</h3>
            <p className="text-gray-600 text-center mb-6 max-w-sm">
              Get started by creating your first AI agent. Agents can perform tasks automatically on schedules.
            </p>
            <Button asChild>
              <Link href="/dashboard/agents/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Agent
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/agents/${agent.id}/edit`}>
                          <Settings className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExecute(agent.id)}>
                        <Play className="mr-2 h-4 w-4" />
                        Execute Now
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/logs?agentId=${agent.id}`}>
                          <Activity className="mr-2 h-4 w-4" />
                          View Logs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusToggle(agent.id, agent.status)}>
                        {agent.status === "active" ? (
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
                      <DropdownMenuItem onClick={() => handleDelete(agent.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2">{agent.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
                  <span className="text-sm text-gray-500">{agent.provider}</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="font-medium">{agent.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Schedule:</span>
                    <span className="font-medium font-mono text-xs">{agent.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tools:</span>
                    <span className="font-medium">{agent.tools.length} tools</span>
                  </div>
                </div>

                {agent.nextRun && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <Clock className="h-4 w-4" />
                    <span>Next run: {formatDate(agent.nextRun)}</span>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Created {formatDate(agent.createdAt)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
