import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { db } from "@/lib/db"
import type { Provider } from "@/lib/types"

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
    const providers = db.providers.filter((p) => p.userId === userId)
    return NextResponse.json(providers)
  } catch (error) {
    console.error("Get providers error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const data = await request.json()

    const provider: Provider = {
      id: `provider-${Date.now()}`,
      userId,
      name: data.name,
      type: data.type,
      apiKey: data.apiKey,
      endpoint: data.endpoint,
      isActive: data.isActive ?? true,
      models: getModelsForProvider(data.type),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.providers.push(provider)
    return NextResponse.json(provider)
  } catch (error) {
    console.error("Create provider error:", error)
    return NextResponse.json({ error: "Failed to create provider" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("id")

    if (!providerId) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 })
    }

    const providerIndex = db.providers.findIndex((p) => p.id === providerId && p.userId === userId)

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

function getModelsForProvider(type: string): string[] {
  switch (type) {
    case "openai":
      return ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"]
    case "anthropic":
      return ["claude-3-sonnet", "claude-3-haiku", "claude-3-opus", "claude-2.1"]
    case "custom":
      return ["custom-model-1", "custom-model-2"]
    default:
      return ["default-model"]
  }
}
