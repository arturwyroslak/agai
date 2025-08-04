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
    const userId = await getUserFromToken(request)
    const { id } = await params

    const agent = db.agents.find((a) => a.id === id && a.userId === userId)

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json(agent)
  } catch (error) {
    console.error("Get agent error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromToken(request)
    const { id } = await params
    const data = await request.json()

    const agentIndex = db.agents.findIndex((a) => a.id === id && a.userId === userId)

    if (agentIndex === -1) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    const updatedAgent = {
      ...db.agents[agentIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    db.agents[agentIndex] = updatedAgent
    return NextResponse.json(updatedAgent)
  } catch (error) {
    console.error("Update agent error:", error)
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromToken(request)
    const { id } = await params

    const agentIndex = db.agents.findIndex((a) => a.id === id && a.userId === userId)

    if (agentIndex === -1) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    db.agents.splice(agentIndex, 1)
    return NextResponse.json({ message: "Agent deleted" })
  } catch (error) {
    console.error("Delete agent error:", error)
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 })
  }
}
