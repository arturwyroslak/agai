import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { db } from "@/lib/db"
import type { CustomTool } from "@/lib/types"

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
    const tools = db.customTools.filter((t) => t.userId === userId)
    return NextResponse.json(tools)
  } catch (error) {
    console.error("Get tools error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const data = await request.json()

    const tool: CustomTool = {
      id: `tool-${Date.now()}`,
      userId,
      name: data.name,
      description: data.description,
      type: data.type,
      code: data.code,
      openApiSpec: data.openApiSpec,
      parameters: data.parameters || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.customTools.push(tool)
    return NextResponse.json(tool)
  } catch (error) {
    console.error("Create tool error:", error)
    return NextResponse.json({ error: "Failed to create tool" }, { status: 500 })
  }
}
