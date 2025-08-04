"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AgentDashboard } from "@/components/agent-dashboard"

export default function AgentsPage() {
  return (
    <DashboardLayout>
      <AgentDashboard />
    </DashboardLayout>
  )
}
