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

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "text/markdown",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Create knowledge file record
    const knowledgeFile: KnowledgeFile = {
      id: `knowledge-${Date.now()}`,
      userId,
      name: file.name,
      type: "file",
      status: "processing",
      chunks: 0,
      size: file.size,
      url: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.knowledgeFiles.push(knowledgeFile)

    // Simulate file processing
    setTimeout(
      () => {
        const fileIndex = db.knowledgeFiles.findIndex((f) => f.id === knowledgeFile.id)
        if (fileIndex !== -1) {
          db.knowledgeFiles[fileIndex] = {
            ...db.knowledgeFiles[fileIndex],
            status: "completed",
            chunks: Math.floor(Math.random() * 100) + 20,
            updatedAt: new Date().toISOString(),
          }
        }
      },
      Math.random() * 4000 + 3000,
    )

    return NextResponse.json({
      message: "File uploaded successfully",
      fileId: knowledgeFile.id,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
