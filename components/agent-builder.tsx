"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Save, Play, ArrowLeft, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { VisualWorkflowEditor } from "./visual-workflow-editor"

export function AgentBuilder() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    provider: "",
    model: "",
    systemPrompt: "",
    schedule: "",
    tools: [] as string[],
    temperature: 0.7,
  })

  const availableTools = [
    { id: "web_search", name: "Web Search", description: "Search the internet for current information" },
    { id: "calculator", name: "Calculator", description: "Perform mathematical calculations" },
    { id: "file_manager", name: "File Manager", description: "Create, read, and manage files" },
    { id: "email_sender", name: "Email Sender", description: "Send emails and notifications" },
    { id: "data_analyzer", name: "Data Analyzer", description: "Analyze and process data" },
  ]

  const schedulePresets = [
    { value: "0 9 * * *", label: "Daily at 9:00 AM" },
    { value: "0 9 * * 1", label: "Weekly on Monday at 9:00 AM" },
    { value: "0 9 1 * *", label: "Monthly on 1st at 9:00 AM" },
    { value: "*/15 * * * *", label: "Every 15 minutes" },
    { value: "0 */6 * * *", label: "Every 6 hours" },
    { value: "custom", label: "Custom cron expression" },
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleTool = (toolId: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.includes(toolId) ? prev.tools.filter((id) => id !== toolId) : [...prev.tools, toolId],
    }))
  }

  const handleSave = async (deploy = false) => {
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: deploy ? "active" : "draft",
        }),
      })

      if (response.ok) {
        toast({
          title: deploy ? "Agent deployed!" : "Agent saved!",
          description: deploy
            ? "Your agent is now active and will run according to schedule."
            : "Your agent has been saved as a draft.",
        })
        router.push("/dashboard/agents")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save agent. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/agents">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create AI Agent</h1>
            <p className="text-muted-foreground">Build an autonomous AI agent</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleSave(false)}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)}>
            <Play className="h-4 w-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Triggers</TabsTrigger>
          <TabsTrigger value="tools">Tools & Capabilities</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Design</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Agent Configuration</span>
              </CardTitle>
              <CardDescription>Configure the basic settings for your AI agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Daily Report Generator"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">AI Provider</Label>
                  <Select value={formData.provider} onValueChange={(value) => handleInputChange("provider", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="custom">Custom Endpoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of what this agent does"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select value={formData.model} onValueChange={(value) => handleInputChange("model", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  placeholder="Define the role, objectives, and behavior of your AI agent..."
                  rows={6}
                  value={formData.systemPrompt}
                  onChange={(e) => handleInputChange("systemPrompt", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Schedule & Triggers</span>
              </CardTitle>
              <CardDescription>Configure when and how your agent should run</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Select value={formData.schedule} onValueChange={(value) => handleInputChange("schedule", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {schedulePresets.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.schedule === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customSchedule">Custom Cron Expression</Label>
                  <Input
                    id="customSchedule"
                    placeholder="0 9 * * * (Daily at 9:00 AM)"
                    onChange={(e) => handleInputChange("schedule", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Use cron syntax: minute hour day month weekday</p>
                </div>
              )}

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Preview
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formData.schedule
                    ? schedulePresets.find((p) => p.value === formData.schedule)?.label ||
                      `Custom: ${formData.schedule}`
                    : "No schedule selected"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Tools</CardTitle>
              <CardDescription>Enable tools to extend your agent's capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTools.map((tool) => (
                  <div key={tool.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      id={tool.id}
                      checked={formData.tools.includes(tool.id)}
                      onCheckedChange={() => toggleTool(tool.id)}
                    />
                    <div className="flex-1">
                      <label htmlFor={tool.id} className="text-sm font-medium cursor-pointer">
                        {tool.name}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Design</CardTitle>
              <CardDescription>Design your agent's task execution workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <VisualWorkflowEditor />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
