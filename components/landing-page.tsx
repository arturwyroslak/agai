"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  Zap,
  Brain,
  Shield,
  Cpu,
  Network,
  ArrowRight,
  CheckCircle,
  Activity,
  Code,
  BarChart3,
  Settings,
} from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "AI Chatbots",
    description: "Deploy intelligent conversational agents with advanced NLP capabilities",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Autonomous Agents",
    description: "Create self-executing AI agents that perform complex tasks automatically",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "Neural Networks",
    description: "Leverage cutting-edge machine learning models for superior performance",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Shield,
    title: "Secure Infrastructure",
    description: "Enterprise-grade security with encrypted data transmission and storage",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: Code,
    title: "Custom Tools",
    description: "Build and integrate custom tools with Python, JavaScript, and APIs",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time monitoring and insights into your AI systems performance",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

const stats = [
  { label: "AI Models", value: "50+", color: "text-primary" },
  { label: "Active Agents", value: "10K+", color: "text-success" },
  { label: "Conversations", value: "1M+", color: "text-accent" },
  { label: "Uptime", value: "99.9%", color: "text-warning" },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-glass border-b border-primary/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 h-8 w-8 rounded-full bg-primary/10 blur-lg"></div>
              </div>
              <span className="text-xl font-bold neon-text font-mono">AI Platform</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-xs font-mono">
                <Activity className="h-3 w-3 text-success" />
                <span className="text-success">SYSTEM ONLINE</span>
              </div>
              <Button asChild className="hud-button-primary font-mono">
                <Link href="/login">ACCESS NEURAL LINK</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="status-processing font-mono">
                <Cpu className="h-3 w-3 mr-1" />
                NEURAL NETWORK ACTIVE
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="neon-text font-mono">AI PLATFORM</span>
                <br />
                <span className="text-foreground font-mono">COMMAND CENTER</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-mono">
                Deploy autonomous AI agents and intelligent chatbots with cutting-edge neural network technology
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="hud-button-primary font-mono text-lg px-8">
                <Link href="/login">
                  INITIALIZE SYSTEM
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="hud-button font-mono text-lg px-8 bg-transparent">
                VIEW DOCUMENTATION
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="hud-card p-6 text-center">
                  <div className={`text-3xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-mono mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="status-active font-mono">
              <Network className="h-3 w-3 mr-1" />
              CORE MODULES
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold neon-text font-mono">NEURAL CAPABILITIES</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-mono">
              Advanced AI systems designed for maximum efficiency and performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hud-card group hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-mono neon-text">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground font-mono">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="hud-card p-12 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold neon-text font-mono">READY TO DEPLOY?</h2>
              <p className="text-xl text-muted-foreground font-mono">
                Join the neural network and start building the future of AI
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="hud-button-primary font-mono text-lg px-8">
                <Link href="/login">
                  <Shield className="mr-2 h-5 w-5" />
                  ACCESS PLATFORM
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="hud-button font-mono text-lg px-8 bg-transparent">
                <Settings className="mr-2 h-5 w-5" />
                SYSTEM REQUIREMENTS
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm font-mono text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Instant deployment</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>24/7 neural support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <Bot className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold neon-text font-mono">AI Platform</span>
            </div>

            <div className="text-sm text-muted-foreground font-mono">
              © 2024 AI Platform. All neural rights reserved.
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <Activity className="h-3 w-3 text-success" />
              <span className="text-success">NEURAL NETWORK OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
