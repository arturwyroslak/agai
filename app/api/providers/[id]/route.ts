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

    const provider = db.providers.find((p) => p.id === id && p.userId === userId)

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    return NextResponse.json(provider)
  } catch (error) {
    console.error("Get provider error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromToken(request)
    const { id } = await params
    const data = await request.json()

    const providerIndex = db.providers.findIndex((p) => p.id === id && p.userId === userId)

    if (providerIndex === -1) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    const updatedProvider = {
      ...db.providers[providerIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    db.providers[providerIndex] = updatedProvider
    return NextResponse.json(updatedProvider)
  } catch (error) {
    console.error("Update provider error:", error)
    return NextResponse.json({ error: "Failed to update provider" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromToken(request)
    const { id } = await params

    const providerIndex = db.providers.findIndex((p) => p.id === id && p.userId === userId)

    if (providerIndex === -1) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    db.providers.splice(providerIndex, 1)
    return NextResponse.json({ message: "Provider deleted" })
  } catch (error) {
    console.error("Delete provider error:", error)
    return NextResponse.json({ error: "Failed to delete provider" }, { status: 500 })
  }
}
