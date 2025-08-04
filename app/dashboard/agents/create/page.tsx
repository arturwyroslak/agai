"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AgentBuilder } from "@/components/agent-builder"

export default function CreateAgentPage() {
  return (
    <DashboardLayout>
      <AgentBuilder />
    </DashboardLayout>
  )
}
