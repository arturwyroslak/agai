"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Clock, Play, Calendar, Zap, AlertTriangle } from "lucide-react"

interface ScheduledAgent {
  id: string
  name: string
  schedule: string
  isActive: boolean
  nextRun: string | null
  lastRun: string | null
  lastStatus: "success" | "failed" | "running" | null
}

export function AgentScheduler() {
  const [agents, setAgents] = useState<ScheduledAgent[]>([])

  useEffect(() => {
    fetchScheduledAgents()

    // Set up real-time updates
    const interval = setInterval(fetchScheduledAgents, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchScheduledAgents = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockAgents: ScheduledAgent[] = [
        {
          id: "1",
          name: "Daily Report Generator",
          schedule: "0 9 * * *",
          isActive: true,
          nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          lastStatus: "success",
        },
        {
          id: "2",
          name: "Content Moderator",
          schedule: "*/15 * * * *",
          isActive: true,
          nextRun: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
          lastRun: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
          lastStatus: "success",
        },
        {
          id: "3",
          name: "Data Backup Agent",
          schedule: "0 2 * * *",
          isActive: false,
          nextRun: null,
          lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          lastStatus: "failed",
        },
      ]
      setAgents(mockAgents)
    } catch (error) {
      console.error("Failed to fetch scheduled agents:", error)
    }
  }

  const toggleAgent = async (agentId: string, isActive: boolean) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? { ...agent, isActive, nextRun: isActive ? new Date(Date.now() + 60000).toISOString() : null }
          : agent,
      ),
    )
  }

  const runAgentNow = async (agentId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/execute`, {
        method: "POST",
      })

      if (response.ok) {
        // Update agent status to running
        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === agentId ? { ...agent, lastStatus: "running", lastRun: new Date().toISOString() } : agent,
          ),
        )
      }
    } catch (error) {
      console.error("Failed to run agent:", error)
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "running":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatNextRun = (nextRun: string | null) => {
    if (!nextRun) return "Not scheduled"

    const now = new Date()
    const next = new Date(nextRun)
    const diff = next.getTime() - now.getTime()

    if (diff < 0) return "Overdue"

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `in ${days} day${days > 1 ? "s" : ""}`
    if (hours > 0) return `in ${hours} hour${hours > 1 ? "s" : ""}`
    if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? "s" : ""}`
    return "in less than a minute"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Scheduler</h2>
          <p className="text-muted-foreground">Monitor and control scheduled agent executions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>{agents.filter((a) => a.isActive).length} Active</span>
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{agent.schedule}</span>
                      </span>
                      {agent.lastRun && (
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Last run: {new Date(agent.lastRun).toLocaleString()}</span>
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`toggle-${agent.id}`} className="text-sm">
                      {agent.isActive ? "Active" : "Inactive"}
                    </Label>
                    <Switch
                      id={`toggle-${agent.id}`}
                      checked={agent.isActive}
                      onCheckedChange={(checked) => toggleAgent(agent.id, checked)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Next Run:</span>
                    <span className="text-sm text-muted-foreground">{formatNextRun(agent.nextRun)}</span>
                  </div>

                  {agent.lastStatus && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Last Status:</span>
                      <Badge className={getStatusColor(agent.lastStatus)}>{agent.lastStatus}</Badge>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runAgentNow(agent.id)}
                    disabled={agent.lastStatus === "running"}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run Now
                  </Button>
                </div>
              </div>

              {agent.nextRun && new Date(agent.nextRun).getTime() < Date.now() && (
                <div className="mt-3 flex items-center space-x-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">This agent is overdue for execution</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {agents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No scheduled agents</h3>
            <p className="text-muted-foreground text-center">Create agents with schedules to see them here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
