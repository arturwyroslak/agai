import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { db } from "@/lib/db"
import type { Agent } from "@/lib/types"

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
    const agents = db.agents.filter((a) => a.userId === userId)
    return NextResponse.json(agents)
  } catch (error) {
    console.error("Get agents error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const data = await request.json()

    const agent: Agent = {
      id: `agent-${Date.now()}`,
      userId,
      name: data.name,
      description: data.description,
      provider: data.provider,
      model: data.model,
      systemPrompt: data.systemPrompt,
      temperature: data.temperature || 0.7,
      schedule: data.schedule,
      status: data.status || "draft",
      tools: data.tools || [],
      nextRun: data.status === "active" ? calculateNextRun(data.schedule) : null,
      lastRun: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.agents.push(agent)
    return NextResponse.json(agent)
  } catch (error) {
    console.error("Create agent error:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}

function calculateNextRun(schedule: string): string | null {
  // Simple schedule calculation - in production, use a proper cron library
  const now = new Date()

  switch (schedule) {
    case "0 9 * * *": // Daily at 9 AM
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      return tomorrow.toISOString()

    case "*/15 * * * *": // Every 15 minutes
      const next15 = new Date(now)
      next15.setMinutes(next15.getMinutes() + 15)
      return next15.toISOString()

    case "0 9 * * 1": // Weekly on Monday at 9 AM
      const nextMonday = new Date(now)
      const daysUntilMonday = (8 - nextMonday.getDay()) % 7 || 7
      nextMonday.setDate(nextMonday.getDate() + daysUntilMonday)
      nextMonday.setHours(9, 0, 0, 0)
      return nextMonday.toISOString()

    default:
      return null
  }
}
