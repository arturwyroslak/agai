"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { EmbeddableChatWidget } from "@/components/embeddable-chat-widget"
import { Loader2 } from "lucide-react"

export default function EmbedPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const chatbotId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [chatbotExists, setChatbotExists] = useState(false)
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    const checkChatbot = async () => {
      try {
        const response = await fetch(`/api/chatbots/${chatbotId}`)
        setChatbotExists(response.ok)

        // Parse configuration from URL parameters
        const configParam = searchParams.get("config")
        if (configParam) {
          try {
            const parsedConfig = JSON.parse(decodeURIComponent(configParam))
            setConfig(parsedConfig)
          } catch (error) {
            console.error("Failed to parse widget configuration:", error)
          }
        }
      } catch (error) {
        setChatbotExists(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (chatbotId) {
      checkChatbot()
    }
  }, [chatbotId, searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!chatbotExists) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Widget not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <EmbeddableChatWidget chatbotId={chatbotId} config={config} />
    </div>
  )
}
