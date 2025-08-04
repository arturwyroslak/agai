import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { db } from "@/lib/db"
import type { Chatbot } from "@/lib/types"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

async function getUserFromToken(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    throw new Error("Not authenticated")
  }

  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload.userId as string
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const chatbots = db.chatbots.filter((c) => c.userId === userId)
    return NextResponse.json(chatbots)
  } catch (error) {
    console.error("Get chatbots error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const data = await request.json()

    const chatbot: Chatbot = {
      id: `chatbot-${Date.now()}`,
      userId,
      name: data.name,
      description: data.description,
      provider: data.provider,
      providerId: data.providerId,
      model: data.model,
      systemPrompt: data.systemPrompt,
      temperature: data.temperature || 0.7,
      maxTokens: data.maxTokens || 1000,
      welcomeMessage: data.welcomeMessage || "Hello! How can I help you today?",
      appearance: data.appearance || {
        primaryColor: "#3b82f6",
        showAvatar: true,
      },
      knowledgeBase: data.knowledgeBase || [],
      tools: data.tools || [],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.chatbots.push(chatbot)
    return NextResponse.json(chatbot)
  } catch (error) {
    console.error("Create chatbot error:", error)
    return NextResponse.json({ error: "Failed to create chatbot" }, { status: 500 })
  }
}
