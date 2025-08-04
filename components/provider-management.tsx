"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Settings, Trash2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Provider {
  id: string
  name: string
  type: string
  apiKey: string
  endpoint: string
  isActive: boolean
  createdAt: string
}

export function ProviderManagement() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    apiKey: "",
    endpoint: "",
    isActive: true,
  })

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      const response = await fetch("/api/providers")
      const data = await response.json()
      setProviders(data)
    } catch (error) {
      console.error("Failed to fetch providers:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Provider added successfully",
          description: "Your AI provider has been configured and is ready to use.",
        })
        setIsDialogOpen(false)
        setFormData({ name: "", type: "", apiKey: "", endpoint: "", isActive: true })
        fetchProviders()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add provider. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteProvider = async (id: string) => {
    try {
      const response = await fetch(`/api/providers?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Provider deleted",
          description: "The AI provider has been removed.",
        })
        fetchProviders()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete provider.",
        variant: "destructive",
      })
    }
  }

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const maskApiKey = (apiKey: string) => {
    if (apiKey.length <= 8) return "*".repeat(apiKey.length)
    return apiKey.substring(0, 4) + "*".repeat(apiKey.length - 8) + apiKey.substring(apiKey.length - 4)
  }

  const getProviderIcon = (type: string) => {
    switch (type) {
      case "openai":
        return "🤖"
      case "anthropic":
        return "🧠"
      case "custom":
        return "⚙️"
      default:
        return "🔧"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Providers</h1>
          <p className="text-muted-foreground">Manage your AI model providers and API configurations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add AI Provider</DialogTitle>
              <DialogDescription>Configure a new AI model provider for your chatbots and agents.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Provider Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., My OpenAI Account"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Provider Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="custom">Custom OpenAI-Compatible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk-..."
                    value={formData.apiKey}
                    onChange={(e) => setFormData((prev) => ({ ...prev, apiKey: e.target.value }))}
                    required
                  />
                </div>
                {formData.type === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="endpoint">API Endpoint</Label>
                    <Input
                      id="endpoint"
                      placeholder="https://api.example.com/v1"
                      value={formData.endpoint}
                      onChange={(e) => setFormData((prev) => ({ ...prev, endpoint: e.target.value }))}
                      required
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">Add Provider</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Providers List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getProviderIcon(provider.type)}</span>
                  <div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription className="capitalize">{provider.type}</CardDescription>
                  </div>
                </div>
                <Badge variant={provider.isActive ? "default" : "secondary"}>
                  {provider.isActive ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {provider.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">API Key</Label>
                    <Button variant="ghost" size="sm" onClick={() => toggleApiKeyVisibility(provider.id)}>
                      {showApiKeys[provider.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm font-mono bg-muted p-2 rounded">
                    {showApiKeys[provider.id] ? provider.apiKey : maskApiKey(provider.apiKey)}
                  </p>
                </div>

                {provider.endpoint && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Endpoint</Label>
                    <p className="text-sm text-muted-foreground break-all">{provider.endpoint}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Settings className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => deleteProvider(provider.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {providers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No providers configured</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first AI provider to start building chatbots and agents.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Provider
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
