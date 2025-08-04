"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatbotDashboard } from "@/components/chatbot-dashboard"

export default function ChatbotsPage() {
  return (
    <DashboardLayout>
      <ChatbotDashboard />
    </DashboardLayout>
  )
}
