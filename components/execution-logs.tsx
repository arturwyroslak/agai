"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Play,
} from "lucide-react"

interface ExecutionLog {
  id: string
  agentId: string
  agentName?: string
  executionId: string
  timestamp: string
  status: "completed" | "failed" | "running"
  duration: number
  logs: Array<{
    timestamp: string
    level: "info" | "error" | "success" | "warning"
    message: string
  }>
  output?: any
  error?: string
}

export function ExecutionLogs() {
  const [logs, setLogs] = useState<ExecutionLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<ExecutionLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchLogs()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [logs, searchTerm, statusFilter])

  const fetchLogs = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockLogs: ExecutionLog[] = [
        {
          id: "1",
          agentId: "agent-1",
          agentName: "Daily Report Generator",
          executionId: "exec-1",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "completed",
          duration: 45000,
          logs: [
            {
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              level: "info",
              message: "Agent execution started",
            },
            {
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10000).toISOString(),
              level: "info",
              message: "Fetching data from external API",
            },
            {
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000).toISOString(),
              level: "info",
              message: "Processing 150 records",
            },
            {
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45000).toISOString(),
              level: "success",
              message: "Report generated successfully",
            },
          ],
          output: {
            filesCreated: ["daily-report-2024-01-15.pdf"],
            recordsProcessed: 150,
            summary: "Daily analytics report generated with 150 processed records",
          },
        },
        {
          id: "2",
          agentId: "agent-2",
          agentName: "Content Moderator",
          executionId: "exec-2",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: "failed",
          duration: 15000,
          logs: [
            {
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              level: "info",
              message: "Agent execution started",
            },
            {
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 10000).toISOString(),
              level: "error",
              message: "Failed to connect to external API",
            },
            {
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 15000).toISOString(),
              level: "error",
              message: "Agent execution failed",
            },
          ],
          error: "Connection timeout to external service",
        },
        {
          id: "3",
          agentId: "agent-1",
          agentName: "Daily Report Generator",
          executionId: "exec-3",
          timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
          status: "completed",
          duration: 52000,
          logs: [
            {
              timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
              level: "info",
              message: "Agent execution started",
            },
            {
              timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000 + 15000).toISOString(),
              level: "info",
              message: "Fetching data from external API",
            },
            {
              timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000 + 35000).toISOString(),
              level: "warning",
              message: "Some records were skipped due to validation errors",
            },
            {
              timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000 + 52000).toISOString(),
              level: "success",
              message: "Report generated with warnings",
            },
          ],
          output: {
            filesCreated: ["daily-report-2024-01-14.pdf"],
            recordsProcessed: 142,
            recordsSkipped: 8,
            summary: "Daily analytics report generated with 142 processed records, 8 skipped",
          },
        },
      ]
      setLogs(mockLogs)
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    }
  }

  const filterLogs = () => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.agentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.executionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.logs.some((l) => l.message.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((log) => log.status === statusFilter)
    }

    setFilteredLogs(filtered)
  }

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "running":
        return <Play className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case "success":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "error":
        return <XCircle className="h-3 w-3 text-red-600" />
      case "warning":
        return <AlertCircle className="h-3 w-3 text-yellow-600" />
      default:
        return <AlertCircle className="h-3 w-3 text-blue-600" />
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    }
    return `${seconds}s`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Execution Logs</h1>
          <p className="text-muted-foreground">Monitor agent executions and troubleshoot issues</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="running">Running</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <Card key={log.id}>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {expandedLogs.has(log.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        {getStatusIcon(log.status)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{log.agentName}</CardTitle>
                        <CardDescription className="flex items-center space-x-4">
                          <span>Execution ID: {log.executionId}</span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                          </span>
                          <span>Duration: {formatDuration(log.duration)}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          log.status === "completed" ? "default" : log.status === "failed" ? "destructive" : "secondary"
                        }
                      >
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Execution Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Execution Details</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Agent ID:</span>
                            <span className="font-mono">{log.agentId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Execution ID:</span>
                            <span className="font-mono">{log.executionId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{formatDuration(log.duration)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge
                              variant={
                                log.status === "completed"
                                  ? "default"
                                  : log.status === "failed"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {log.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Output/Error */}
                      {log.output && (
                        <div>
                          <h4 className="font-medium mb-2">Output</h4>
                          <div className="bg-muted p-3 rounded-lg">
                            <pre className="text-xs overflow-x-auto">{JSON.stringify(log.output, null, 2)}</pre>
                          </div>
                        </div>
                      )}

                      {log.error && (
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Error</h4>
                          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                            <p className="text-sm text-red-800">{log.error}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Detailed Logs */}
                    <div>
                      <h4 className="font-medium mb-2">Execution Logs</h4>
                      <ScrollArea className="h-64 border rounded-lg">
                        <div className="p-4 space-y-2">
                          {log.logs.map((logEntry, index) => (
                            <div key={index} className="flex items-start space-x-3 text-sm">
                              <div className="flex items-center space-x-2 min-w-0">
                                {getLogLevelIcon(logEntry.level)}
                                <span className="text-xs text-muted-foreground font-mono">
                                  {new Date(logEntry.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <span className="flex-1">{logEntry.message}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No execution logs found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Agent execution logs will appear here once your agents start running."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
