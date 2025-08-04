import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { chatbotId, message, history } = await request.json()

    if (!chatbotId || !message) {
      return NextResponse.json({ error: "Chatbot ID and message are required" }, { status: 400 })
    }

    const chatbot = db.chatbots.find((c) => c.id === chatbotId)

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    if (chatbot.status !== "active") {
      return NextResponse.json({ error: "Chatbot is not active" }, { status: 400 })
    }

    // Simulate AI response generation
    const responses = [
      "I understand your question. Let me help you with that.",
      "That's a great question! Based on my knowledge, I can provide you with some insights.",
      "I'd be happy to assist you with this. Here's what I can tell you:",
      "Thank you for asking. This is an important topic that I can help explain.",
      "I see what you're looking for. Let me share some relevant information with you.",
      "That's an interesting point. Based on the context you've provided, here's my response:",
      "I can definitely help you with that. Here's what you need to know:",
      "Great question! Let me break this down for you in a clear way.",
    ]

    // Select a random response and add some context
    const baseResponse = responses[Math.floor(Math.random() * responses.length)]
    const contextualResponse = `${baseResponse}\n\nBased on your message "${message}", I can provide more specific guidance. Is there anything particular about this topic you'd like me to elaborate on?`

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 500))

    return NextResponse.json({
      message: contextualResponse,
      chatbotId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
