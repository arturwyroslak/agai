"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, Download, Settings, Code } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WidgetCustomizerProps {
  chatbotId: string
  chatbotName: string
}

export function WidgetCustomizer({ chatbotId, chatbotName }: WidgetCustomizerProps) {
  const { toast } = useToast()
  const [config, setConfig] = useState({
    primaryColor: "#3b82f6",
    position: "bottom-right",
    welcomeMessage: "Hi! How can I help you?",
    chatbotName: chatbotName,
    showAvatar: true,
    showHeader: true,
    borderRadius: "8",
    width: "320",
    height: "400",
  })

  const positions = [
    { value: "bottom-right", label: "Bottom Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "top-right", label: "Top Right" },
    { value: "top-left", label: "Top Left" },
  ]

  const generateEmbedCode = () => {
    const baseUrl = window.location.origin
    return `<!-- AI Platform Chat Widget -->
<script>
  (function() {
    var chatWidget = document.createElement('iframe');
    chatWidget.src = '${baseUrl}/embed/${chatbotId}?config=${encodeURIComponent(JSON.stringify(config))}';
    chatWidget.style.position = 'fixed';
    chatWidget.style.${config.position.includes("bottom") ? "bottom" : "top"} = '20px';
    chatWidget.style.${config.position.includes("right") ? "right" : "left"} = '20px';
    chatWidget.style.width = '${config.width}px';
    chatWidget.style.height = '${config.height}px';
    chatWidget.style.border = 'none';
    chatWidget.style.borderRadius = '${config.borderRadius}px';
    chatWidget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    chatWidget.style.zIndex = '9999';
    chatWidget.setAttribute('allow', 'microphone');
    
    document.body.appendChild(chatWidget);
  })();
</script>`
  }

  const generateReactCode = () => {
    return `import React from 'react';

const ChatWidget = () => {
  return (
    <iframe
      src="${window.location.origin}/embed/${chatbotId}?config=${encodeURIComponent(JSON.stringify(config))}"
      style={{
        position: 'fixed',
        ${config.position.includes("bottom") ? "bottom" : "top"}: '20px',
        ${config.position.includes("right") ? "right" : "left"}: '20px',
        width: '${config.width}px',
        height: '${config.height}px',
        border: 'none',
        borderRadius: '${config.borderRadius}px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
      }}
      allow="microphone"
    />
  );
};

export default ChatWidget;`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The embed code has been copied to your clipboard.",
    })
  }

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Widget Customizer</h2>
          <p className="text-muted-foreground">Customize and embed your chatbot widget</p>
        </div>
        <Badge variant="secondary">{chatbotName}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Widget Configuration</span>
            </CardTitle>
            <CardDescription>Customize the appearance and behavior of your widget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="behavior">Behavior</TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={config.position}
                    onValueChange={(value) => setConfig((prev) => ({ ...prev, position: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={config.width}
                      onChange={(e) => setConfig((prev) => ({ ...prev, width: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={config.height}
                      onChange={(e) => setConfig((prev) => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="borderRadius">Border Radius (px)</Label>
                  <Input
                    id="borderRadius"
                    type="number"
                    value={config.borderRadius}
                    onChange={(e) => setConfig((prev) => ({ ...prev, borderRadius: e.target.value }))}
                  />
                </div>
              </TabsContent>

              <TabsContent value="behavior" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chatbotName">Chatbot Name</Label>
                  <Input
                    id="chatbotName"
                    value={config.chatbotName}
                    onChange={(e) => setConfig((prev) => ({ ...prev, chatbotName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={config.welcomeMessage}
                    onChange={(e) => setConfig((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Live Preview</span>
            </CardTitle>
            <CardDescription>See how your widget will look</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-100 rounded-lg p-4 h-64 overflow-hidden">
              <div className="text-xs text-gray-500 mb-2">Your website content...</div>

              {/* Widget Preview */}
              <div
                className={`absolute w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer`}
                style={{
                  backgroundColor: config.primaryColor,
                  [config.position.includes("bottom") ? "bottom" : "top"]: "16px",
                  [config.position.includes("right") ? "right" : "left"]: "16px",
                }}
              >
                💬
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Embed Code</span>
          </CardTitle>
          <CardDescription>Copy and paste this code into your website</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="html" className="w-full">
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="space-y-4">
              <div className="relative">
                <Textarea value={generateEmbedCode()} readOnly rows={12} className="font-mono text-sm" />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(generateEmbedCode())}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadCode(generateEmbedCode(), "chat-widget.html")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="react" className="space-y-4">
              <div className="relative">
                <Textarea value={generateReactCode()} readOnly rows={12} className="font-mono text-sm" />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(generateReactCode())}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadCode(generateReactCode(), "ChatWidget.jsx")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
