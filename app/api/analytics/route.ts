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

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)

    // Generate mock analytics data
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const conversationTrends = []
    const agentExecutions = []

    // Generate daily data for the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)

      conversationTrends.push({
        date: date.toISOString(),
        conversations: Math.floor(Math.random() * 200) + 50,
        messages: Math.floor(Math.random() * 1000) + 200,
      })

      agentExecutions.push({
        date: date.toISOString(),
        successful: Math.floor(Math.random() * 50) + 10,
        failed: Math.floor(Math.random() * 10) + 1,
      })
    }

    const userChatbots = db.chatbots.filter((c) => c.userId === userId)
    const userAgents = db.agents.filter((a) => a.userId === userId)

    const analytics = {
      overview: {
        totalConversations: 1247,
        totalMessages: 8934,
        activeUsers: 423,
        avgResponseTime: 1.2,
        satisfactionScore: 4.3,
      },
      conversationTrends,
      agentExecutions,
      topChatbots: userChatbots.slice(0, 5).map((chatbot, index) => ({
        id: chatbot.id,
        name: chatbot.name,
        conversations: Math.floor(Math.random() * 500) + 100,
        satisfaction: (4.0 + Math.random() * 1).toFixed(1),
      })),
      userEngagement: {
        avgSessionDuration: 12.5,
        bounceRate: 0.23,
        returnUsers: 0.67,
        peakHours: [9, 10, 11, 14, 15, 16],
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
