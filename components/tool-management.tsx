"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Wrench, Trash2, Edit, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CustomTool {
  id: string
  name: string
  description: string
  type: "python" | "javascript" | "openapi"
  code?: string
  openApiSpec?: string
  createdAt: string
  updatedAt: string
}

export function ToolManagement() {
  const [tools, setTools] = useState<CustomTool[]>([
    {
      id: "1",
      name: "Weather Checker",
      description: "Get current weather information for any city",
      type: "python",
      code: `def get_weather(city: str) -> dict:
    # Mock weather function
    return {
        "city": city,
        "temperature": "22°C",
        "condition": "Sunny"
    }`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Text Analyzer",
      description: "Analyze text sentiment and extract keywords",
      type: "javascript",
      code: `function analyzeText(text) {
    // Mock analysis function
    return {
        sentiment: 'positive',
        keywords: text.split(' ').slice(0, 3),
        wordCount: text.split(' ').length
    };
}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "python" as "python" | "javascript" | "openapi",
    code: "",
    openApiSpec: "",
  })

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newTool: CustomTool = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTools((prev) => [...prev, newTool])
    setIsDialogOpen(false)
    setFormData({
      name: "",
      description: "",
      type: "python",
      code: "",
      openApiSpec: "",
    })

    toast({
      title: "Tool created successfully",
      description: "Your custom tool is now available in the workflow editor.",
    })
  }

  const deleteTool = (id: string) => {
    setTools((prev) => prev.filter((tool) => tool.id !== id))
    toast({
      title: "Tool deleted",
      description: "The custom tool has been removed.",
    })
  }

  const getToolIcon = (type: string) => {
    switch (type) {
      case "python":
        return "🐍"
      case "javascript":
        return "🟨"
      case "openapi":
        return "📋"
      default:
        return "🔧"
    }
  }

  const getDefaultCode = (type: string) => {
    switch (type) {
      case "python":
        return `def my_function(input_param: str) -> dict:
    """
    Your custom Python function
    """
    # Your code here
    return {"result": input_param}
`
      case "javascript":
        return `function myFunction(inputParam) {
    /**
     * Your custom JavaScript function
     */
    // Your code here
    return { result: inputParam };
}
`
      case "openapi":
        return `openapi: 3.0.0
info:
  title: My Custom API
  version: 1.0.0
paths:
  /my-endpoint:
    get:
      summary: My custom endpoint
      responses:
        '200':
          description: Success
`
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Tools</h1>
          <p className="text-muted-foreground">Create reusable tools for your chatbots and agents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Custom Tool</DialogTitle>
              <DialogDescription>Build a custom tool that can be used in your AI workflows.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tool Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Weather Checker"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tool Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "python" | "javascript" | "openapi") =>
                        setFormData((prev) => ({
                          ...prev,
                          type: value,
                          code: getDefaultCode(value),
                          openApiSpec: value === "openapi" ? getDefaultCode(value) : "",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tool type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python">Python Function</SelectItem>
                        <SelectItem value="javascript">JavaScript Function</SelectItem>
                        <SelectItem value="openapi">OpenAPI Spec</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this tool does..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">{formData.type === "openapi" ? "OpenAPI Specification" : "Code"}</Label>
                  <Textarea
                    id="code"
                    placeholder={getDefaultCode(formData.type)}
                    value={formData.type === "openapi" ? formData.openApiSpec : formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [formData.type === "openapi" ? "openApiSpec" : "code"]: e.target.value,
                      }))
                    }
                    rows={12}
                    className="font-mono text-sm"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Tool</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getToolIcon(tool.type)}</span>
                  <div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {tool.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted p-3 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    <code>
                      {tool.type === "openapi"
                        ? tool.openApiSpec?.substring(0, 100) + "..."
                        : tool.code?.substring(0, 100) + "..."}
                    </code>
                  </pre>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Play className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => deleteTool(tool.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tools.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No custom tools yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first custom tool to extend your AI capabilities.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Tool
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
