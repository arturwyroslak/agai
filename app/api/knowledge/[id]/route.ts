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

    const fileIndex = db.knowledgeFiles.findIndex((f) => f.id === id && f.userId === userId)

    if (fileIndex === -1) {
      return NextResponse.json({ error: "Knowledge file not found" }, { status: 404 })
    }

    db.knowledgeFiles.splice(fileIndex, 1)
    return NextResponse.json({ message: "Knowledge file deleted" })
  } catch (error) {
    console.error("Delete knowledge file error:", error)
    return NextResponse.json({ error: "Failed to delete knowledge file" }, { status: 500 })
  }
}
