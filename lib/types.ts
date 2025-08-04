export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface Provider {
  id: string
  name: string
  type: "openai" | "anthropic" | "custom"
  apiKey: string
  endpoint?: string
  isActive: boolean
  models: string[]
  createdAt: string
}

export interface CustomTool {
  id: string
  name: string
  description: string
  type: "python" | "javascript" | "openapi"
  code?: string
  openApiSpec?: string
  createdAt: string
  updatedAt: string
}

export interface KnowledgeFile {
  id: string
  name: string
  type: "file" | "url"
  status: "processing" | "completed" | "failed"
  chunks: number
  size?: number
  url?: string
  createdAt: string
}

export interface Chatbot {
  id: string
  name: string
  description: string
  provider: string
  providerId: string
  model: string
  systemPrompt: string
  temperature: number
  maxTokens: number
  welcomeMessage: string
  appearance: {
    primaryColor: string
    showAvatar: boolean
  }
  knowledgeBase: string[]
  tools: string[]
  status: "active" | "inactive" | "draft"
  createdAt: string
  updatedAt: string
}

export interface Agent {
  id: string
  name: string
  description: string
  provider: string
  model: string
  systemPrompt: string
  schedule: string
  tools: string[]
  temperature: number
  status: "active" | "inactive" | "draft"
  nextRun?: string
  lastRun?: string
  createdAt: string
  updatedAt: string
}

export interface ExecutionLog {
  id: string
  agentId: string
  agentName?: string
  executionId: string
  status: "completed" | "failed" | "running"
  startTime: string
  endTime?: string
  duration?: number
  output?: any
  error?: string
  logs: Array<{
    timestamp: string
    level: "info" | "error" | "success" | "warning"
    message: string
  }>
}
