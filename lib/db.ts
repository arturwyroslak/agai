import bcrypt from "bcryptjs"
import type { User, Provider, Chatbot, Agent, CustomTool, KnowledgeFile, ExecutionLog, Conversation } from "./types"

// Mock database - In production, use a real database
export const db = {
  users: [
    {
      id: "user-1",
      name: "Demo User",
      email: "demo@neural.ai",
      password: bcrypt.hashSync("demo123", 10),
      avatar: "/placeholder.svg?height=32&width=32",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "user-2",
      name: "Admin User",
      email: "admin@neural.ai",
      password: bcrypt.hashSync("admin123", 10),
      avatar: "/placeholder.svg?height=32&width=32",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as User[],

  providers: [
    {
      id: "provider-1",
      userId: "user-1",
      name: "OpenAI GPT-4",
      type: "openai" as const,
      apiKey: "sk-demo-key-12345",
      isActive: true,
      models: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "provider-2",
      userId: "user-1",
      name: "Anthropic Claude",
      type: "anthropic" as const,
      apiKey: "sk-ant-demo-key-67890",
      isActive: true,
      models: ["claude-3-sonnet", "claude-3-haiku", "claude-3-opus", "claude-2.1"],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as Provider[],

  chatbots: [
    {
      id: "chatbot-1",
      userId: "user-1",
      name: "Customer Support Bot",
      description: "AI-powered customer support assistant that helps users with common questions and issues",
      provider: "OpenAI GPT-4",
      providerId: "provider-1",
      model: "gpt-4o",
      systemPrompt:
        "You are a helpful customer support assistant. Be friendly, professional, and provide accurate information. If you don't know something, politely admit it and offer to escalate to a human agent.",
      temperature: 0.7,
      maxTokens: 1000,
      welcomeMessage:
        "Hello! I'm here to help you with any questions or issues you might have. How can I assist you today?",
      appearance: {
        primaryColor: "#3b82f6",
        showAvatar: true,
      },
      knowledgeBase: ["knowledge-1", "knowledge-2"],
      tools: ["tool-1"],
      status: "active" as const,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "chatbot-2",
      userId: "user-1",
      name: "Sales Assistant",
      description: "AI sales assistant that helps qualify leads and provides product information",
      provider: "Anthropic Claude",
      providerId: "provider-2",
      model: "claude-3-sonnet",
      systemPrompt:
        "You are a knowledgeable sales assistant. Help potential customers understand our products and services. Be persuasive but not pushy. Focus on understanding customer needs and matching them with appropriate solutions.",
      temperature: 0.8,
      maxTokens: 1200,
      welcomeMessage:
        "Welcome! I'm here to help you find the perfect solution for your needs. What brings you here today?",
      appearance: {
        primaryColor: "#10b981",
        showAvatar: true,
      },
      knowledgeBase: ["knowledge-3"],
      tools: [],
      status: "active" as const,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as Chatbot[],

  agents: [
    {
      id: "agent-1",
      userId: "user-1",
      name: "Daily Report Generator",
      description: "Automatically generates daily analytics reports and sends them to stakeholders",
      provider: "OpenAI GPT-4",
      model: "gpt-4o",
      systemPrompt:
        "You are an AI agent responsible for generating comprehensive daily reports. Analyze the provided data, identify key trends and insights, and create professional reports in a clear, concise format.",
      temperature: 0.3,
      schedule: "0 9 * * *", // Daily at 9 AM
      status: "active" as const,
      tools: ["tool-2", "tool-3"],
      nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "agent-2",
      userId: "user-1",
      name: "Content Moderator",
      description: "Monitors user-generated content and flags inappropriate material",
      provider: "Anthropic Claude",
      model: "claude-3-haiku",
      systemPrompt:
        "You are a content moderation agent. Review submitted content for policy violations, inappropriate language, spam, or harmful material. Flag concerning content and provide brief explanations for your decisions.",
      temperature: 0.2,
      schedule: "*/15 * * * *", // Every 15 minutes
      status: "active" as const,
      tools: ["tool-1"],
      nextRun: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
      lastRun: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as Agent[],

  customTools: [
    {
      id: "tool-1",
      userId: "user-1",
      name: "Weather Checker",
      description: "Get current weather information for any city worldwide",
      type: "python" as const,
      code: `import requests
import json

def get_weather(city: str) -> dict:
    """
    Get current weather information for a given city
    """
    # Mock weather API call
    mock_data = {
        "city": city,
        "temperature": "22°C",
        "condition": "Sunny",
        "humidity": "45%",
        "wind_speed": "15 km/h"
    }
    return mock_data`,
      parameters: {
        city: {
          type: "string",
          description: "The name of the city to get weather for",
          required: true,
        },
      },
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "tool-2",
      userId: "user-1",
      name: "Email Sender",
      description: "Send emails with custom content and attachments",
      type: "javascript" as const,
      code: `async function sendEmail(to, subject, body, attachments = []) {
    /**
     * Send an email with the specified parameters
     */
    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    console.log('Body:', body);
    
    // Mock email sending
    return {
        success: true,
        messageId: 'msg_' + Date.now(),
        sentAt: new Date().toISOString()
    };
}`,
      parameters: {
        to: {
          type: "string",
          description: "Recipient email address",
          required: true,
        },
        subject: {
          type: "string",
          description: "Email subject line",
          required: true,
        },
        body: {
          type: "string",
          description: "Email body content",
          required: true,
        },
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "tool-3",
      userId: "user-1",
      name: "Data Analyzer",
      description: "Analyze datasets and generate insights",
      type: "python" as const,
      code: `import pandas as pd
import numpy as np
from datetime import datetime

def analyze_data(data: list) -> dict:
    """
    Analyze a dataset and return key insights
    """
    if not data:
        return {"error": "No data provided"}
    
    # Convert to pandas DataFrame for analysis
    df = pd.DataFrame(data)
    
    analysis = {
        "total_records": len(df),
        "columns": list(df.columns),
        "data_types": df.dtypes.to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "summary_stats": df.describe().to_dict() if len(df.select_dtypes(include=[np.number]).columns) > 0 else {},
        "analyzed_at": datetime.now().isoformat()
    }
    
    return analysis`,
      parameters: {
        data: {
          type: "array",
          description: "Dataset to analyze (array of objects)",
          required: true,
        },
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as CustomTool[],

  knowledgeFiles: [
    {
      id: "knowledge-1",
      userId: "user-1",
      name: "Company FAQ.pdf",
      type: "file" as const,
      status: "completed" as const,
      chunks: 45,
      size: 2048576, // 2MB
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "knowledge-2",
      userId: "user-1",
      name: "Product Documentation.md",
      type: "file" as const,
      status: "completed" as const,
      chunks: 78,
      size: 1572864, // 1.5MB
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "knowledge-3",
      userId: "user-1",
      name: "Sales Playbook",
      type: "url" as const,
      status: "completed" as const,
      chunks: 32,
      url: "https://example.com/sales-playbook",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ] as KnowledgeFile[],

  executionLogs: [
    {
      id: "log-1",
      userId: "user-1",
      agentId: "agent-1",
      agentName: "Daily Report Generator",
      executionId: "exec-1",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45000).toISOString(),
      status: "completed" as const,
      duration: 45000,
      logs: [
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          level: "info" as const,
          message: "Agent execution started",
        },
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10000).toISOString(),
          level: "info" as const,
          message: "Fetching analytics data from database",
        },
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000).toISOString(),
          level: "info" as const,
          message: "Processing 1,247 conversation records",
        },
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45000).toISOString(),
          level: "success" as const,
          message: "Daily report generated and sent successfully",
        },
      ],
      output: {
        reportGenerated: true,
        recordsProcessed: 1247,
        recipientsSent: 5,
        reportUrl: "https://reports.neural.ai/daily-2024-01-15.pdf",
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45000).toISOString(),
    },
    {
      id: "log-2",
      userId: "user-1",
      agentId: "agent-2",
      agentName: "Content Moderator",
      executionId: "exec-2",
      startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 30 * 60 * 1000 + 8000).toISOString(),
      status: "completed" as const,
      duration: 8000,
      logs: [
        {
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          level: "info" as const,
          message: "Content moderation cycle started",
        },
        {
          timestamp: new Date(Date.now() - 30 * 60 * 1000 + 3000).toISOString(),
          level: "info" as const,
          message: "Scanning 23 new submissions",
        },
        {
          timestamp: new Date(Date.now() - 30 * 60 * 1000 + 6000).toISOString(),
          level: "warning" as const,
          message: "Flagged 2 submissions for manual review",
        },
        {
          timestamp: new Date(Date.now() - 30 * 60 * 1000 + 8000).toISOString(),
          level: "success" as const,
          message: "Content moderation completed",
        },
      ],
      output: {
        submissionsScanned: 23,
        approved: 21,
        flagged: 2,
        rejected: 0,
      },
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000 + 8000).toISOString(),
    },
  ] as ExecutionLog[],

  conversations: [] as Conversation[],
}
