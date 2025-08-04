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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromToken(request)
    const { id } = await params

    const toolIndex = db.customTools.findIndex((t) => t.id === id && t.userId === userId)

    if (toolIndex === -1) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    db.customTools.splice(toolIndex, 1)
    return NextResponse.json({ message: "Tool deleted" })
  } catch (error) {
    console.error("Delete tool error:", error)
    return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromToken(request)
    const { id } = await params
    const data = await request.json()

    const toolIndex = db.customTools.findIndex((t) => t.id === id && t.userId === userId)

    if (toolIndex === -1) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    const updatedTool = {
      ...db.customTools[toolIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    db.customTools[toolIndex] = updatedTool
    return NextResponse.json(updatedTool)
  } catch (error) {
    console.error("Update tool error:", error)
    return NextResponse.json({ error: "Failed to update tool" }, { status: 500 })
  }
}
