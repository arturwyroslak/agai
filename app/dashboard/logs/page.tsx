"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ExecutionLogs } from "@/components/execution-logs"

export default function LogsPage() {
  return (
    <DashboardLayout>
      <ExecutionLogs />
    </DashboardLayout>
  )
}
