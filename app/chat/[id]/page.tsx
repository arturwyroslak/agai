"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PublicChatInterface } from "@/components/public-chat-interface"
import { Loader2 } from "lucide-react"

export default function ChatPage() {
  const params = useParams()
  const chatbotId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [chatbotExists, setChatbotExists] = useState(false)

  useEffect(() => {
    const checkChatbot = async () => {
      try {
        const response = await fetch(`/api/chatbots/${chatbotId}`)
        setChatbotExists(response.ok)
      } catch (error) {
        setChatbotExists(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (chatbotId) {
      checkChatbot()
    }
  }, [chatbotId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Initializing neural interface...</p>
        </div>
      </div>
    )
  }

  if (!chatbotExists) {
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Chatbot Not Found</h1>
          <p className="text-muted-foreground">The requested AI consciousness could not be located.</p>
        </div>
      </div>
    )
  }

  return <PublicChatInterface chatbotId={chatbotId} />
}
