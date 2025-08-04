import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { db } from "@/lib/db"
import type { ExecutionLog } from "@/lib/types"

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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromToken(request)
    const { id } = await params

    const agent = db.agents.find((a) => a.id === id && a.userId === userId)

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Create execution log
    const executionLog: ExecutionLog = {
      id: `log-${Date.now()}`,
      userId,
      agentId: agent.id,
      agentName: agent.name,
      executionId: `exec-${Date.now()}`,
      startTime: new Date().toISOString(),
      endTime: null,
      status: "running",
      duration: 0,
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: "info",
          message: "Agent execution started",
        },
      ],
      output: null,
      error: null,
    }

    db.executionLogs.push(executionLog)

    // Simulate agent execution (in production, this would be a real AI agent execution)
    setTimeout(async () => {
      try {
        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 5000 + 2000))

        // Update execution log with completion
        const logIndex = db.executionLogs.findIndex((l) => l.id === executionLog.id)
        if (logIndex !== -1) {
          const endTime = new Date().toISOString()
          const startTime = new Date(executionLog.startTime)
          const duration = new Date(endTime).getTime() - startTime.getTime()

          db.executionLogs[logIndex] = {
            ...db.executionLogs[logIndex],
            endTime,
            status: Math.random() > 0.1 ? "completed" : "failed", // 90% success rate
            duration,
            logs: [
              ...db.executionLogs[logIndex].logs,
              {
                timestamp: new Date(Date.now() - 1000).toISOString(),
                level: "info",
                message: "Processing agent workflow",
              },
              {
                timestamp: endTime,
                level: Math.random() > 0.1 ? "success" : "error",
                message: Math.random() > 0.1 ? "Agent execution completed successfully" : "Agent execution failed",
              },
            ],
            output:
              Math.random() > 0.1
                ? {
                    tasksCompleted: Math.floor(Math.random() * 5) + 1,
                    dataProcessed: `${Math.floor(Math.random() * 1000) + 100} records`,
                    result: "Agent workflow executed successfully",
                  }
                : null,
            error: Math.random() > 0.1 ? null : "Simulated execution error",
          }

          // Update agent's last run time
          const agentIndex = db.agents.findIndex((a) => a.id === agent.id)
          if (agentIndex !== -1) {
            db.agents[agentIndex].lastRun = endTime
          }
        }
      } catch (error) {
        console.error("Agent execution simulation error:", error)
      }
    }, 0)

    return NextResponse.json({
      message: "Agent execution started",
      executionId: executionLog.executionId,
    })
  } catch (error) {
    console.error("Execute agent error:", error)
    return NextResponse.json({ error: "Failed to execute agent" }, { status: 500 })
  }
}
