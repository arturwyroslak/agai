"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProviderManagement } from "@/components/provider-management"

export default function ProvidersPage() {
  return (
    <DashboardLayout>
      <ProviderManagement />
    </DashboardLayout>
  )
}
