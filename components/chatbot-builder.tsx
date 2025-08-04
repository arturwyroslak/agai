"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bot, Save, ArrowLeft, Upload } from "lucide-react"
import type { Provider, CustomTool, KnowledgeFile } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export function ChatbotBuilder() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [providers, setProviders] = useState<Provider[]>([])
  const [tools, setTools] = useState<CustomTool[]>([])
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    provider: "",
    providerId: "",
    model: "",
    systemPrompt: "",
    temperature: [0.7],
    maxTokens: [1000],
    welcomeMessage: "Hello! How can I help you today?",
    primaryColor: "#3b82f6",
    showAvatar: true,
    selectedKnowledge: [] as string[],
    selectedTools: [] as string[],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [providersRes, toolsRes, knowledgeRes] = await Promise.all([
        fetch("/api/providers"),
        fetch("/api/tools"),
        fetch("/api/knowledge"),
      ])

      const [providersData, toolsData, knowledgeData] = await Promise.all([
        providersRes.json(),
        toolsRes.json(),
        knowledgeRes.json(),
      ])

      setProviders(providersData.filter((p: Provider) => p.isActive))
      setTools(toolsData)
      setKnowledgeFiles(knowledgeData.filter((f: KnowledgeFile) => f.status === "completed"))
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast({
        title: "Error",
        description: "Failed to load configuration data",
        variant: "destructive",
      })
    }
  }

  const handleProviderChange = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId)
    if (provider) {
      setFormData((prev) => ({
        ...prev,
        providerId,
        provider: provider.name,
        model: provider.models[0] || "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          provider: formData.provider,
          providerId: formData.providerId,
          model: formData.model,
          systemPrompt: formData.systemPrompt,
          temperature: formData.temperature[0],
          maxTokens: formData.maxTokens[0],
          welcomeMessage: formData.welcomeMessage,
          appearance: {
            primaryColor: formData.primaryColor,
            showAvatar: formData.showAvatar,
          },
          knowledgeBase: formData.selectedKnowledge,
          tools: formData.selectedTools,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Chatbot created successfully",
        })
        router.push("/dashboard/chatbots")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to create chatbot")
      }
    } catch (error) {
      console.error("Failed to create chatbot:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create chatbot",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedProvider = providers.find((p) => p.id === formData.providerId)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Chatbot</h1>
          <p className="text-muted-foreground">Build an intelligent AI chatbot for your business</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="ai">AI Configuration</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Set up the basic details for your chatbot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Chatbot Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Customer Support Bot"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your chatbot does..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    placeholder="The first message users will see..."
                    value={formData.welcomeMessage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>Configure the AI model and behavior settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">AI Provider *</Label>
                  <Select value={formData.providerId} onValueChange={handleProviderChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an AI provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name} ({provider.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProvider && (
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Select
                      value={formData.model}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, model: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProvider.models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt *</Label>
                  <Textarea
                    id="systemPrompt"
                    placeholder="You are a helpful assistant that..."
                    value={formData.systemPrompt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                    rows={4}
                    required
                  />
                  <p className="text-sm text-muted-foreground">This defines your chatbot's personality and behavior</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Temperature: {formData.temperature[0]}</Label>
                    <Slider
                      value={formData.temperature}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, temperature: value }))}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">Higher values make responses more creative</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Tokens: {formData.maxTokens[0]}</Label>
                    <Slider
                      value={formData.maxTokens}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, maxTokens: value }))}
                      max={4000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">Maximum length of responses</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Available Tools</Label>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool) => (
                      <Badge
                        key={tool.id}
                        variant={formData.selectedTools.includes(tool.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            selectedTools: prev.selectedTools.includes(tool.id)
                              ? prev.selectedTools.filter((id) => id !== tool.id)
                              : [...prev.selectedTools, tool.id],
                          }))
                        }}
                      >
                        {tool.name}
                      </Badge>
                    ))}
                  </div>
                  {tools.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No custom tools available. Create tools in the Tools section.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>Select files and documents for your chatbot to reference</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Available Knowledge Files</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {knowledgeFiles.map((file) => (
                      <div
                        key={file.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.selectedKnowledge.includes(file.id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            selectedKnowledge: prev.selectedKnowledge.includes(file.id)
                              ? prev.selectedKnowledge.filter((id) => id !== file.id)
                              : [...prev.selectedKnowledge, file.id],
                          }))
                        }}
                      >
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.chunks} chunks • {file.type}
                          </p>
                        </div>
                        {formData.selectedKnowledge.includes(file.id) && <Badge>Selected</Badge>}
                      </div>
                    ))}
                  </div>
                  {knowledgeFiles.length === 0 && (
                    <div className="text-center py-8">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        No knowledge files available. Upload files in the Knowledge section.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how your chatbot looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData((prev) => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => setFormData((prev) => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Avatar</Label>
                    <p className="text-sm text-muted-foreground">Display an avatar icon in the chat interface</p>
                  </div>
                  <Switch
                    checked={formData.showAvatar}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, showAvatar: checked }))}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-3">
                      {formData.showAvatar && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: formData.primaryColor }}
                        >
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className="max-w-xs px-3 py-2 rounded-lg text-white text-sm"
                        style={{ backgroundColor: formData.primaryColor }}
                      >
                        {formData.welcomeMessage || "Hello! How can I help you today?"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex items-center justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading || !formData.name || !formData.providerId || !formData.model || !formData.systemPrompt
              }
            >
              {isLoading && <Save className="mr-2 h-4 w-4 animate-spin" />}
              Create Chatbot
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  )
}
