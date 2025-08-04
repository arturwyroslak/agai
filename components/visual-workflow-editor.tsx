"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, Play, MessageSquare, Zap, GitBranch, CheckCircle, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WorkflowNode {
  id: string
  type: "start" | "message" | "condition" | "action" | "end"
  position: { x: number; y: number }
  data: {
    title: string
    content?: string
    condition?: string
    action?: string
    tool?: string
    parameters?: Record<string, any>
  }
  connections: string[]
}

interface WorkflowConnection {
  id: string
  from: string
  to: string
  label?: string
}

export function VisualWorkflowEditor() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "start",
      type: "start",
      position: { x: 100, y: 100 },
      data: { title: "Start" },
      connections: [],
    },
  ])
  const [connections, setConnections] = useState<WorkflowConnection[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const nodeTypes = [
    { type: "message", label: "Send Message", icon: MessageSquare, color: "bg-blue-500" },
    { type: "condition", label: "Condition", icon: GitBranch, color: "bg-yellow-500" },
    { type: "action", label: "Action", icon: Zap, color: "bg-green-500" },
    { type: "end", label: "End", icon: CheckCircle, color: "bg-red-500" },
  ]

  const addNode = (type: WorkflowNode["type"]) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      position: { x: 200 + nodes.length * 50, y: 200 + nodes.length * 50 },
      data: {
        title: type.charAt(0).toUpperCase() + type.slice(1),
        content: type === "message" ? "Hello! How can I help you?" : "",
        condition: type === "condition" ? "user_input contains 'help'" : "",
        action: type === "action" ? "search_knowledge_base" : "",
      },
      connections: [],
    }
    setNodes((prev) => [...prev, newNode])
  }

  const deleteNode = (nodeId: string) => {
    if (nodeId === "start") return // Can't delete start node

    setNodes((prev) => prev.filter((n) => n.id !== nodeId))
    setConnections((prev) => prev.filter((c) => c.from !== nodeId && c.to !== nodeId))

    // Remove connections from other nodes
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        connections: node.connections.filter((id) => id !== nodeId),
      })),
    )
  }

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)))
  }

  const connectNodes = (fromId: string, toId: string) => {
    if (fromId === toId) return

    const connectionExists = connections.some((c) => c.from === fromId && c.to === toId)
    if (connectionExists) return

    const newConnection: WorkflowConnection = {
      id: `${fromId}-${toId}`,
      from: fromId,
      to: toId,
    }

    setConnections((prev) => [...prev, newConnection])
    setNodes((prev) =>
      prev.map((node) => (node.id === fromId ? { ...node, connections: [...node.connections, toId] } : node)),
    )
  }

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault()
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return

    setDraggedNode(nodeId)
    setDragOffset({
      x: e.clientX - rect.left - node.position.x,
      y: e.clientY - rect.top - node.position.y,
    })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggedNode || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const newPosition = {
        x: e.clientX - rect.left - dragOffset.x,
        y: e.clientY - rect.top - dragOffset.y,
      }

      updateNode(draggedNode, { position: newPosition })
    },
    [draggedNode, dragOffset],
  )

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null)
  }, [])

  useEffect(() => {
    if (draggedNode) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [draggedNode, handleMouseMove, handleMouseUp])

  const getNodeIcon = (type: WorkflowNode["type"]) => {
    switch (type) {
      case "start":
        return Play
      case "message":
        return MessageSquare
      case "condition":
        return GitBranch
      case "action":
        return Zap
      case "end":
        return CheckCircle
      default:
        return MessageSquare
    }
  }

  const getNodeColor = (type: WorkflowNode["type"]) => {
    switch (type) {
      case "start":
        return "bg-green-500"
      case "message":
        return "bg-blue-500"
      case "condition":
        return "bg-yellow-500"
      case "action":
        return "bg-purple-500"
      case "end":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const saveWorkflow = () => {
    const workflow = { nodes, connections }
    console.log("Saving workflow:", workflow)
    toast({
      title: "Workflow Saved",
      description: "Your workflow has been saved successfully.",
    })
  }

  const executeWorkflow = () => {
    toast({
      title: "Workflow Executed",
      description: "Your workflow is now running in test mode.",
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium">Workflow Editor</h3>
          <Badge variant="secondary">{nodes.length} nodes</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={saveWorkflow}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" onClick={executeWorkflow}>
            <Play className="h-4 w-4 mr-2" />
            Test
          </Button>
        </div>
      </div>

      {/* Node Palette */}
      <div className="flex items-center space-x-2 p-4 border rounded-lg">
        <span className="text-sm font-medium">Add Node:</span>
        {nodeTypes.map(({ type, label, icon: Icon, color }) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => addNode(type as WorkflowNode["type"])}
            className="flex items-center space-x-2"
          >
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Button>
        ))}
      </div>

      {/* Canvas */}
      <div className="relative">
        <div
          ref={canvasRef}
          className="relative w-full h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden"
          style={{ minHeight: "600px" }}
        >
          {/* Render connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((connection) => {
              const fromNode = nodes.find((n) => n.id === connection.from)
              const toNode = nodes.find((n) => n.id === connection.to)
              if (!fromNode || !toNode) return null

              const fromX = fromNode.position.x + 60
              const fromY = fromNode.position.y + 30
              const toX = toNode.position.x + 60
              const toY = toNode.position.y + 30

              return (
                <g key={connection.id}>
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#6b7280"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              )
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
              </marker>
            </defs>
          </svg>

          {/* Render nodes */}
          {nodes.map((node) => {
            const Icon = getNodeIcon(node.type)
            return (
              <div
                key={node.id}
                className="absolute cursor-move select-none"
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  transform: draggedNode === node.id ? "scale(1.05)" : "scale(1)",
                  transition: draggedNode === node.id ? "none" : "transform 0.2s",
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onClick={() => {
                  setSelectedNode(node)
                  setIsEditDialogOpen(true)
                }}
              >
                <div className="bg-white border-2 border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow p-3 min-w-[120px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-6 h-6 rounded-full ${getNodeColor(node.type)} flex items-center justify-center`}>
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium truncate">{node.data.title}</span>
                  </div>
                  {node.data.content && <p className="text-xs text-gray-600 truncate">{node.data.content}</p>}
                  {node.data.condition && <p className="text-xs text-gray-600 truncate">If: {node.data.condition}</p>}
                  {node.data.action && <p className="text-xs text-gray-600 truncate">Do: {node.data.action}</p>}

                  {/* Connection points */}
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                  </div>
                  <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-sm" />
                  </div>
                </div>
              </div>
            )
          })}

          {/* Instructions */}
          {nodes.length === 1 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Build Your Workflow</p>
                <p className="text-sm">Add nodes from the toolbar above to create your conversation flow</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Node Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
            <DialogDescription>Configure the settings for this workflow node</DialogDescription>
          </DialogHeader>

          {selectedNode && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={selectedNode.data.title}
                  onChange={(e) =>
                    setSelectedNode({
                      ...selectedNode,
                      data: { ...selectedNode.data, title: e.target.value },
                    })
                  }
                />
              </div>

              {selectedNode.type === "message" && (
                <div className="space-y-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    value={selectedNode.data.content || ""}
                    onChange={(e) =>
                      setSelectedNode({
                        ...selectedNode,
                        data: { ...selectedNode.data, content: e.target.value },
                      })
                    }
                    rows={3}
                  />
                </div>
              )}

              {selectedNode.type === "condition" && (
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Input
                    id="condition"
                    placeholder="e.g., user_input contains 'help'"
                    value={selectedNode.data.condition || ""}
                    onChange={(e) =>
                      setSelectedNode({
                        ...selectedNode,
                        data: { ...selectedNode.data, condition: e.target.value },
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Use expressions like: user_input contains 'keyword', sentiment == 'positive'
                  </p>
                </div>
              )}

              {selectedNode.type === "action" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="action">Action Type</Label>
                    <Select
                      value={selectedNode.data.action || ""}
                      onValueChange={(value) =>
                        setSelectedNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, action: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="search_knowledge_base">Search Knowledge Base</SelectItem>
                        <SelectItem value="call_api">Call External API</SelectItem>
                        <SelectItem value="send_email">Send Email</SelectItem>
                        <SelectItem value="create_ticket">Create Support Ticket</SelectItem>
                        <SelectItem value="transfer_human">Transfer to Human</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tool">Tool (Optional)</Label>
                    <Select
                      value={selectedNode.data.tool || ""}
                      onValueChange={(value) =>
                        setSelectedNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, tool: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tool" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web_search">Web Search</SelectItem>
                        <SelectItem value="calculator">Calculator</SelectItem>
                        <SelectItem value="email_sender">Email Sender</SelectItem>
                        <SelectItem value="file_manager">File Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Node ID: {selectedNode.id}</div>
                {selectedNode.id !== "start" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteNode(selectedNode.id)
                      setIsEditDialogOpen(false)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Node
                  </Button>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedNode) {
                  updateNode(selectedNode.id, selectedNode)
                  setIsEditDialogOpen(false)
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
