"use client"

import { useChat } from "ai/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, Send, MessageCircle, X } from "lucide-react"

interface EmbeddableChatWidgetProps {
  chatbotId: string
  config?: {
    primaryColor?: string
    position?: string
    welcomeMessage?: string
    chatbotName?: string
    showAvatar?: boolean
    showHeader?: boolean
    borderRadius?: string
    width?: string
    height?: string
  }
}

export function EmbeddableChatWidget({ chatbotId, config = {} }: EmbeddableChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [chatbotConfig, setChatbotConfig] = useState<any>(null)

  const {
    primaryColor = "#3b82f6",
    welcomeMessage = "Hi! How can I help you?",
    chatbotName = "Support Assistant",
    showAvatar = true,
    showHeader = true,
  } = config

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { chatbotId },
  })

  useEffect(() => {
    // Fetch chatbot configuration
    const fetchConfig = async () => {
      try {
        const response = await fetch(`/api/chatbots/${chatbotId}`)
        if (response.ok) {
          const data = await response.json()
          setChatbotConfig(data)
        }
      } catch (error) {
        console.error("Failed to fetch chatbot config:", error)
      }
    }

    fetchConfig()
  }, [chatbotId])

  if (!chatbotConfig) return null

  const finalConfig = {
    name: config.chatbotName || chatbotConfig.name || chatbotName,
    primaryColor: config.primaryColor || chatbotConfig.appearance?.primaryColor || primaryColor,
    welcomeMessage: config.welcomeMessage || chatbotConfig.welcomeMessage || welcomeMessage,
    showAvatar: config.showAvatar ?? chatbotConfig.appearance?.showAvatar ?? showAvatar,
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border flex flex-col">
          {/* Header */}
          {showHeader && (
            <div
              className="flex items-center justify-between p-4 rounded-t-lg text-white"
              style={{ backgroundColor: finalConfig.primaryColor }}
            >
              <div className="flex items-center space-x-2">
                {finalConfig.showAvatar && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white/20">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="font-medium">{finalConfig.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="flex items-start space-x-2">
                  {finalConfig.showAvatar && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gray-100">
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm max-w-[200px]">
                    {finalConfig.welcomeMessage}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && finalConfig.showAvatar && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gray-100">
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`rounded-lg px-3 py-2 text-sm max-w-[200px] break-words ${
                      message.role === "user" ? "text-white" : "bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: message.role === "user" ? finalConfig.primaryColor : undefined,
                    }}
                  >
                    {message.content}
                  </div>

                  {message.role === "user" && finalConfig.showAvatar && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gray-100">
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-2">
                  {finalConfig.showAvatar && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gray-100">
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex space-x-2 p-4 border-t">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !input.trim()}
              style={{ backgroundColor: finalConfig.primaryColor }}
            >
              <Send className="h-3 w-3" />
            </Button>
          </form>
        </div>
      )}

      {/* Chat Bubble */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
        style={{ backgroundColor: finalConfig.primaryColor }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  )
}
