import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { db } from "@/lib/db"

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // For public access to chatbot info (needed for embed/chat pages)
    const chatbot = db.chatbots.find((c) => c.id === id)

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    // Return limited info for public access
    const publicChatbot = {
      id: chatbot.id,
      name: chatbot.name,
      description: chatbot.description,
      welcomeMessage: chatbot.welcomeMessage,
      appearance: chatbot.appearance,
      status: chatbot.status,
    }

    return NextResponse.json(publicChatbot)
  } catch (error) {
    console.error("Get chatbot error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromToken(request)
    const { id } = await params
    const data = await request.json()

    const chatbotIndex = db.chatbots.findIndex((c) => c.id === id && c.userId === userId)

    if (chatbotIndex === -1) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    const updatedChatbot = {
      ...db.chatbots[chatbotIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    db.chatbots[chatbotIndex] = updatedChatbot
    return NextResponse.json(updatedChatbot)
  } catch (error) {
    console.error("Update chatbot error:", error)
    return NextResponse.json({ error: "Failed to update chatbot" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromToken(request)
    const { id } = await params

    const chatbotIndex = db.chatbots.findIndex((c) => c.id === id && c.userId === userId)

    if (chatbotIndex === -1) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
    }

    db.chatbots.splice(chatbotIndex, 1)
    return NextResponse.json({ message: "Chatbot deleted" })
  } catch (error) {
    console.error("Delete chatbot error:", error)
    return NextResponse.json({ error: "Failed to delete chatbot" }, { status: 500 })
  }
}
