import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { db } from "@/lib/db"
import type { KnowledgeFile } from "@/lib/types"

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
    const knowledgeFiles = db.knowledgeFiles.filter((f) => f.userId === userId)
    return NextResponse.json(knowledgeFiles)
  } catch (error) {
    console.error("Get knowledge files error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const data = await request.json()

    const knowledgeFile: KnowledgeFile = {
      id: `knowledge-${Date.now()}`,
      userId,
      name: data.name,
      type: data.type,
      status: "processing",
      chunks: 0,
      size: data.size,
      url: data.url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.knowledgeFiles.push(knowledgeFile)

    // Simulate processing
    setTimeout(
      () => {
        const fileIndex = db.knowledgeFiles.findIndex((f) => f.id === knowledgeFile.id)
        if (fileIndex !== -1) {
          db.knowledgeFiles[fileIndex] = {
            ...db.knowledgeFiles[fileIndex],
            status: "completed",
            chunks: Math.floor(Math.random() * 50) + 10,
            updatedAt: new Date().toISOString(),
          }
        }
      },
      Math.random() * 3000 + 2000,
    )

    return NextResponse.json(knowledgeFile)
  } catch (error) {
    console.error("Create knowledge file error:", error)
    return NextResponse.json({ error: "Failed to create knowledge file" }, { status: 500 })
  }
}
